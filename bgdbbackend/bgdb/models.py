from django.db import models

class Boardgame(models.Model):
	id = models.IntegerField(primary_key=True)
	description = models.TextField(blank=True,null=True)
	thumbnail = models.URLField(blank=True,null=True)
	image = models.URLField(blank=True,null=True)
	name = models.TextField(blank=True,null=True)
	year_published = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	min_players = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	max_players = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	playing_time = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	min_play_time = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	max_play_time = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	min_age = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	num_ratings = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	average_rating = models.FloatField(db_index=True,blank=True,null=True)
	bayes_average_rating = models.FloatField(db_index=True,blank=True,null=True)
	standard_deviation = models.FloatField(db_index=True,blank=True,null=True,default=None)
	median = models.FloatField(db_index=True,blank=True,null=True,default=None)
	owned = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	trading = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	wanting = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	wishing = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	num_comments = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	num_weights = models.IntegerField(db_index=True,null=True,blank=True,default=None)
	average_weight = models.FloatField(db_index=True,null=True,blank=True,default=None)
	


class SuggestedPlayerPollResponse(models.Model):
	NOTREC = 'NR'
	REC = 'RC'
	BEST = 'BE'
	RESPONSE_CHOICES = [
		(NOTREC, 'Not Recommended'),
		(REC, 'Recommended'),
		(BEST, 'Best'),
	]

	player_count = models.IntegerField(null=True,blank=True,default=None)
	highest_count = models.BooleanField(default=False)
	response = models.CharField(
		max_length=2,
		choices = RESPONSE_CHOICES,
	)
	num_votes = models.IntegerField(null=True,blank=True,default=None)
	boardgame = models.ForeignKey(Boardgame, on_delete=models.CASCADE)

	class Meta:
		unique_together = ('player_count','response','boardgame')

class SuggestedAgePollResponse(models.Model):
	age = models.IntegerField(null=True,blank=True,default=None)
	highest_age = models.BooleanField(default=False)
	num_votes = models.IntegerField(null=True,blank=True,default=None)
	boardgame = models.ForeignKey(Boardgame, on_delete=models.CASCADE)

	class Meta:
		unique_together = ('age','boardgame')

class LanguageDependencyPollResponse(models.Model):
	dependency_level = models.IntegerField(null=True,blank=True,default=None)
	dependency_text = models.CharField(max_length=70)
	num_votes = models.IntegerField(null=True,blank=True,default=None)
	boardgame = models.ForeignKey(Boardgame, on_delete=models.CASCADE)

	class Meta:
		unique_together = ('dependency_level', 'boardgame')


class AlternateName(models.Model):
	name = models.TextField()
	boardgame = models.ForeignKey(Boardgame, on_delete=models.CASCADE)

class Designer(models.Model):
	name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class Publisher(models.Model):
	name = models.CharField(max_length=200)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class Category(models.Model):
	name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class Mechanic(models.Model):
	name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class Family(models.Model):
	name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class Artist(models.Model):
	name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame)

class RankingList(models.Model):
	name = models.CharField(max_length=60)
	display_name = models.CharField(max_length=128)
	id = models.IntegerField(primary_key=True)
	boardgames = models.ManyToManyField(Boardgame, through='Placement')

class Placement(models.Model):
	boardgame = models.ForeignKey(Boardgame, on_delete=models.CASCADE)
	ranking_list = models.ForeignKey(RankingList, on_delete=models.CASCADE)
	rank = models.IntegerField(null=True,default=None,blank=True)

	class Meta:
		unique_together = ('boardgame', 'ranking_list')









