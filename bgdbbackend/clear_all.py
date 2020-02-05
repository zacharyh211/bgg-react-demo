
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bgdbbackend.settings')

import django
django.setup()
from bgdb.models import AlternateName, Boardgame, Designer, Publisher, Category, Mechanic, Family, Artist, SuggestedPlayerPollResponse, SuggestedAgePollResponse, LanguageDependencyPollResponse, RankingList, Placement

response = input('CLEAR ALL TABLES? [Y/N]')

if response and response.lower()[0] == 'y':

	Boardgame.objects.all().delete()
	Designer.objects.all().delete()
	Publisher.objects.all().delete()
	Category.objects.all().delete()
	Mechanic.objects.all().delete()
	Family.objects.all().delete()
	Artist.objects.all().delete()
	SuggestedPlayerPollResponse.objects.all().delete()
	SuggestedAgePollResponse.objects.all().delete()
	LanguageDependencyPollResponse.objects.all().delete()
	RankingList.objects.all().delete()
	Placement.objects.all().delete()
	AlternateName.objects.all().delete()