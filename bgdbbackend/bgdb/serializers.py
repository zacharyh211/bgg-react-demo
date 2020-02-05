
from rest_framework import serializers
from bgdb.models import Boardgame, Mechanic, Designer, Category, Artist, Publisher


class DesignerSerializer(serializers.ModelSerializer):


	class Meta:
		model = Designer
		fields = ('id','name')

class ArtistSerializer(serializers.ModelSerializer):

	class Meta:
		model = Artist
		fields = ('id','name')

class PublisherSerializer(serializers.ModelSerializer):

	class Meta:
		model = Publisher
		fields = ('id','name')

class MechanicSerializer(serializers.ModelSerializer):

	class Meta:
		model = Mechanic
		fields = ('id','name')

class CategorySerializer(serializers.ModelSerializer):

	class Meta:
		model = Category
		fields = ('id','name')


class BoardgameSerializer(serializers.ModelSerializer):

	designer_set = DesignerSerializer(read_only=True, many=True)
	artist_set = ArtistSerializer(read_only=True, many=True)
	publisher_set = PublisherSerializer(read_only=True, many=True)
	mechanic_set = MechanicSerializer(read_only=True, many=True)
	category_set = CategorySerializer(read_only=True, many=True)


	class Meta:
		model = Boardgame
		fields = '__all__'