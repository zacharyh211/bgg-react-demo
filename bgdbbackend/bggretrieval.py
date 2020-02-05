
import sys
import re
import requests
from lxml import etree
import os
import time
import traceback
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bgdbbackend.settings')

import django
django.setup()

from bgdb.models import AlternateName, Boardgame, Designer, Publisher, Category, Mechanic, Family, Artist, SuggestedPlayerPollResponse, SuggestedAgePollResponse, LanguageDependencyPollResponse, RankingList, Placement




def retrieve_game_data(ids):

	url = 'http://www.boardgamegeek.com/xmlapi2/thing'
	params = {'type':'boardgame','stats':'1','id':','.join(ids)}

	r = requests.get(url,params)
	factor = 1
	while r.status_code == 202 or (r.content and 'Rate limit exceeded.' in str(r.content)):
		r = requests.get(url,params)
		time.sleep(0.5*factor)
		factor *= 2
	parsed = etree.fromstring(r.content)
	arr = [game_to_dict(i) for i in parsed]

	if None in arr:
		s = etree.tostring(parsed, xml_declaration=True, encoding="UTF-8", pretty_print=True)
		print(s)
		sys.exit(0)

	return arr

to_response = {
	'Not Recommended': SuggestedPlayerPollResponse.NOTREC,
	'Recommended' : SuggestedPlayerPollResponse.REC,
	'Best' : SuggestedPlayerPollResponse.BEST,
}

def id_to_database_bulkified(ids):
	retrieval_results = retrieve_game_data(ids)
	boardgame_objects = [Boardgame(**attributes) for attributes,_ in retrieval_results]

	category_objects = [[Category(**attributes) for attributes in relations['categories']] for _,relations in retrieval_results]
	mechanic_objects = [[Mechanic(**attributes) for attributes in relations['mechanics']] for _,relations in retrieval_results]
	family_objects = [[Family(**attributes) for attributes in relations['families']] for _,relations in retrieval_results]
	designer_objects = [[Designer(**attributes) for attributes in relations['designers']] for _,relations in retrieval_results]
	artist_objects = [[Artist(**attributes) for attributes in relations['artists']] for _,relations in retrieval_results]
	publisher_objects = [[Publisher(**attributes) for attributes in relations['publishers']] for _,relations in retrieval_results]

	flatten = lambda lst : [item for arr in lst for item in arr]

	Boardgame.objects.bulk_create(boardgame_objects, ignore_conflicts = True)
	Category.objects.bulk_create(flatten(category_objects), ignore_conflicts = True)
	Mechanic.objects.bulk_create(flatten(mechanic_objects), ignore_conflicts = True)
	Family.objects.bulk_create(flatten(family_objects), ignore_conflicts = True)
	Designer.objects.bulk_create(flatten(designer_objects), ignore_conflicts = True)
	Artist.objects.bulk_create(flatten(artist_objects), ignore_conflicts = True)
	Publisher.objects.bulk_create(flatten(publisher_objects), ignore_conflicts = True)

	Category.boardgames.through.objects.bulk_create([
		Category.boardgames.through(boardgame_id = game.pk, category_id = item.pk)
		for game, item_list in zip(boardgame_objects, category_objects) for item in item_list
	], ignore_conflicts = True)

	Mechanic.boardgames.through.objects.bulk_create([
		Mechanic.boardgames.through(boardgame_id = game.pk, mechanic_id = item.pk)
		for game, item_list in zip(boardgame_objects, mechanic_objects) for item in item_list
	], ignore_conflicts = True)

	Family.boardgames.through.objects.bulk_create([
		Family.boardgames.through(boardgame_id = game.pk, family_id = item.pk)
		for game, item_list in zip(boardgame_objects, family_objects) for item in item_list
	], ignore_conflicts = True)

	Designer.boardgames.through.objects.bulk_create([
		Designer.boardgames.through(boardgame_id = game.pk, designer_id = item.pk)
		for game, item_list in zip(boardgame_objects, designer_objects) for item in item_list
	], ignore_conflicts = True)

	Artist.boardgames.through.objects.bulk_create([
		Artist.boardgames.through(boardgame_id = game.pk, artist_id = item.pk)
		for game, item_list in zip(boardgame_objects, artist_objects) for item in item_list
	], ignore_conflicts = True)

	Publisher.boardgames.through.objects.bulk_create([
		Publisher.boardgames.through(boardgame_id = game.pk, publisher_id = item.pk)
		for game, item_list in zip(boardgame_objects, publisher_objects) for item in item_list
	], ignore_conflicts = True)

	AlternateName.objects.bulk_create(
		[AlternateName(boardgame=game, **response) for (_,relations),game in zip(retrieval_results, boardgame_objects) for response in relations['alt_names']]
	)

	SuggestedPlayerPollResponse.objects.bulk_create(
		[SuggestedPlayerPollResponse(boardgame=game, **response) for (_,relations),game in zip(retrieval_results, boardgame_objects) for response in relations['playerCountPoll']],
		ignore_conflicts = True
	)
	SuggestedAgePollResponse.objects.bulk_create(
		[SuggestedAgePollResponse(boardgame=game, **response) for (_,relations),game in zip(retrieval_results, boardgame_objects) for response in relations['agePoll']],
		ignore_conflicts = True
	)
	LanguageDependencyPollResponse.objects.bulk_create(
		[LanguageDependencyPollResponse(boardgame=game, **response) for (_,relations),game in zip(retrieval_results, boardgame_objects) for response in relations['languageDependencyPoll']],
		ignore_conflicts = True
	)

	ranking_objects = [RankingList(id=attributes['id'], display_name=attributes['display_name'], name=attributes['name']) for _,relations in retrieval_results for attributes in relations['rankings']]
	RankingList.objects.bulk_create(ranking_objects, ignore_conflicts = True)

	Placement.objects.bulk_create(
		[Placement(boardgame = game, ranking_list = lst, rank = attributes['rank']) for game,lst,relations in zip(boardgame_objects, ranking_objects, map(lambda x: x[1], retrieval_results)) for attributes in relations['rankings']],
		ignore_conflicts = True
	)


		
def id_to_database(ids):

	for attributes, relations in retrieve_game_data(ids):
		cur_game,created = Boardgame.objects.update_or_create(id=attributes['id'],defaults=attributes)

		for args in relations['categories']:
			c,_ = Category.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.category_set.add(c)

		for args in relations['mechanics']:
			m,_ = Mechanic.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.mechanic_set.add(m)
			#cur_game.mechanic_set.all().update_or_create(id=args['id'],defaults={'name':args['name']})

		for args in relations['families']:
			f,_ = Family.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.family_set.add(f)

		for args in relations['designers']:
			d,_ = Designer.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.designer_set.add(d)

		for args in relations['artists']:
			a,_ = Artist.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.artist_set.add(a)

		for args in relations['publishers']:
			p,_ = Publisher.objects.update_or_create(id=args['id'],defaults={'name':args['name']})
			cur_game.publisher_set.add(p)

		for response in relations['playerCountPoll']:
			cur_game.suggestedplayerpollresponse_set.update_or_create(
				player_count=response['player_count'],
				response=response['response'],
				defaults={'num_votes': response['num_votes']},
			)

		for response in relations['agePoll']:
			cur_game.suggestedagepollresponse_set.update_or_create(
				age=response['age'],
				defaults=response,
			)
		for response in relations['languageDependencyPoll']:
			cur_game.languagedependencypollresponse_set.update_or_create(
				dependency_level=response['dependency_level'],
				defaults=response,
			)

		for ranking in relations['rankings']:
			ranking_list,created = RankingList.objects.update_or_create(
				id = ranking['id'],
				defaults={'display_name':ranking['display_name'], 'name':ranking['name']},
			)
			Placement.objects.update_or_create(
				boardgame=cur_game,
				ranking_list = ranking_list,
				defaults={'rank':ranking['rank']},
			)

		for alt_name in relations['alt_names']:
			cur_game.alternatename_set.update_or_create(**alt_name)

def game_to_dict_lol(e):

	out = dict()

	key = e.get('id')

	if not key:
		return None

	if e.find('.//stddev') is not None and e.find('.//stddev').get('value').replace('.','').isnumeric():
		out['standard_deviation'] = float(e.find('.//stddev').get('value'))
	if e.find('.//median') is not None and e.find('.//median').get('value').replace('.','').isnumeric():
		out['median'] = float(e.find('.//median').get('value'))
	if e.find('.//owned') is not None and e.find('.//owned').get('value').isnumeric():
		out['owned'] = int(e.find('.//owned').get('value'))
	if e.find('.//trading') is not None and e.find('.//trading').get('value').isnumeric():
		out['trading'] = int(e.find('.//trading').get('value'))
	if e.find('.//wanting') is not None and e.find('.//wanting').get('value').isnumeric():
		out['wanting'] = int(e.find('.//wanting').get('value'))
	if e.find('.//wishing') is not None and e.find('.//wishing').get('value').isnumeric():
		out['wishing'] = int(e.find('.//wishing').get('value'))
	if e.find('.//numcomments') is not None and e.find('.//numcomments').get('value').isnumeric():
		out['num_comments'] = int(e.find('.//numcomments').get('value'))
	if e.find('.//numweights') is not None and e.find('.//numweights').get('value').isnumeric():
		out['num_weights'] = int(e.find('.//numweights').get('value'))
	if e.find('.//averageweight') is not None and e.find('.//averageweight').get('value').replace('.','').isnumeric():
		out['average_weight'] = float(e.find('.//averageweight').get('value'))

	return key,out

def patching(ids):
	updated_columns = retrieve_game_data(ids)

	for key,game_data in updated_columns:
		Boardgame.objects.filter(pk=key).update(**game_data)

def game_to_dict(e):

	out = dict()
	relations = dict()

	out['id'] = e.get('id')

	if not out['id']:
		return None

	if e.find('description') is not None:
		out['description'] = e.find('description').text
	if e.find('thumbnail') is not None:
		out['thumbnail'] = e.find('thumbnail').text
	if e.find('image') is not None:
		out['image'] = e.find('image').text
	if e.find('.//name[@type="primary"]') is not None:
		out['name'] = e.find('.//name[@type="primary"]').get('value')
	if e.find('yearpublished') is not None and e.find('yearpublished').get('value').isnumeric():
		out['year_published'] = int(e.find('yearpublished').get('value'))
	if e.find('minplayers') is not None and e.find('minplayers').get('value').isnumeric():
		out['min_players'] = int(e.find('minplayers').get('value'))
	if e.find('maxplayers') is not None and e.find('maxplayers').get('value').isnumeric():
		out['max_players'] = int(e.find('maxplayers').get('value'))
	if e.find('playingtime') is not None and e.find('playingtime').get('value').isnumeric():
		out['playing_time'] = int(e.find('playingtime').get('value'))
	if e.find('minplaytime') is not None and e.find('minplaytime').get('value').isnumeric():
		out['min_play_time'] = int(e.find('minplaytime').get('value'))
	if e.find('maxplaytime') is not None and e.find('maxplaytime').get('value').isnumeric():
		out['max_play_time'] = int(e.find('maxplaytime').get('value'))
	if e.find('minage') is not None and e.find('minage').get('value').isnumeric():
		out['min_age'] = int(e.find('minage').get('value'))

	relations['playerCountPoll'] = []

	for poll_row in e.findall('.//poll[@name="suggested_numplayers"]/results'):
		ct = re.sub(r'\d+\+', lambda x: str(int(x.group(0)[0])+1), poll_row.get('numplayers'))
		num_players = poll_row.get('numplayers')[0]
		if num_players == '+':
			continue
		highest = '+' in poll_row.get('numplayers')

		for poll_response in poll_row:
			relations['playerCountPoll'].append({
				'player_count':ct, 
				'highest_count':highest,
				'response': to_response[poll_response.get('value')],
				'num_votes': poll_response.get('numvotes'),
			})

	relations['agePoll'] = [{
		'age': int(x.get('value').split()[0]),
		'num_votes': int(x.get('numvotes')),

	} for x in e.findall('.//poll[@name="suggested_playerage"]/results/result')]


	relations['languageDependencyPoll'] = [{
		'dependency_level':int(x.get('level')),
		'dependency_text':x.get('value'),
		'num_votes':int(x.get('numvotes')),

	} for x in e.findall('.//poll[@name="language_dependence"]/results/result')]

	relations['categories'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgamecategory"]')]
	relations['mechanics'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgamemechanic"]')]
	relations['families'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgamefamily"]')]
	relations['designers'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgamedesigner"]')]
	relations['artists'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgameartist"]')]
	relations['publishers'] = [{'id':int(x.get('id')), 'name':x.get('value')} for x in e.findall('.//link[@type="boardgamepublisher"]')]

	if e.find('.//usersrated') is not None and e.find('.//usersrated').get('value').isnumeric():
		out['num_ratings'] = int(e.find('.//usersrated').get('value'))
	if e.find('.//ratings/average') is not None and e.find('.//ratings/average').get('value').replace('.','').isnumeric():
		out['average_rating'] = float(e.find('.//ratings/average').get('value'))
	if e.find('.//ratings/bayesaverage') is not None and e.find('.//ratings/average').get('value').replace('.','').isnumeric():
		out['bayes_average_rating'] = float(e.find('.//ratings/bayesaverage').get('value'))

	relations['rankings'] = [{
		'id':int(rank.get('id')),
		'name':rank.get('name'),
		'display_name':rank.get('friendlyname'),
		'rank':(int(rank.get('value')) if rank.get('value').isnumeric() else None),
	} for rank in e.findall('.//ranks/rank')]

	relations['alt_names'] = [{
		'name':entry.get('value'),
	} for entry in e.findall('.//name[@type="alternate"]')]

	return (out, relations)

if __name__ == '__main__':
	MAX_ASK_SIZE = 500
	SECONDS_BETWEEN_REQUESTS = 0.5
	lower,upper = map(int,sys.argv[1:])

	begin = lower
	for end in range(lower+MAX_ASK_SIZE,upper+MAX_ASK_SIZE,MAX_ASK_SIZE):
		try:
			patching(map(str,range(begin,min(end,upper))))
			print('{} to {} complete.'.format(begin, min(end,upper)))
		except KeyboardInterrupt:
			sys.exit(0)
		except Exception as e:
			print('FAILED IN BLOCK:   ',begin,end)
			with open('log.txt','a') as f:
				f.write(str(e)+'\n')
				f.write(traceback.format_exc())
				f.write('\n------------\n')
		begin = end














































