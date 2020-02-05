from rest_framework import generics, viewsets, pagination
from rest_framework.filters import OrderingFilter as OrderingFilter
from django_filters import rest_framework as filters
from rest_framework.response import Response

from django.db.models import F
from bgdb.models import Boardgame, Mechanic, Category, Designer, Publisher, Artist
from bgdb.serializers import BoardgameSerializer, MechanicSerializer, CategorySerializer, DesignerSerializer, ArtistSerializer, PublisherSerializer

from functools import reduce


# Create your views here.

class BoardgameFilter(filters.FilterSet):

	class M2MFilter(filters.Filter):
		def filter(self, qs, value):
			if not value:
				return qs
			values = value.split(',')
			for v in values:
				qs = qs.filter(**{self.field_name: v})
			return qs

	mechanics = M2MFilter(field_name='mechanic__name', lookup_expr='iexact')
	categories = M2MFilter(field_name='category__name', lookup_expr='iexact')
	boardgame__name = filters.Filter(field_name='name', lookup_expr='icontains')
	designer__name = filters.Filter(field_name='designer__name', lookup_expr='icontains', distinct=True)
	publisher__name = filters.Filter(field_name='publisher__name',lookup_expr='icontains', distinct=True)
	artist__name = filters.Filter(field_name='artist__name',lookup_expr='icontains', distinct=True)

	class Meta:
		model = Boardgame
		fields = {
			'id':['exact'],
			'name':['exact'],
			'mechanic__name':['exact'],
			'category__name':['exact'],
			'year_published':['exact','lte','gte'],
			'average_rating':['lte','gte'],
			'num_ratings':['lte','gte'],
			'average_weight':['lte','gte'],
			'playing_time':['lte','gte'],
			'owned':['lte','gte'],
			'wishing':['lte','gte'],
		}

class CustomPagination(pagination.PageNumberPagination):
	page_size = 60
	page_query_param = 'page'
	page_size_query_param = 'page_size'
	max_page_size = 100

	def get_paginated_response(self,data):
		return Response({
            'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })

class NullLastOrderingFilter(OrderingFilter):
	def filter_queryset(self, request, queryset, view):
		ordering = self.get_ordering(request, queryset, view)
		direction = request.query_params.get('order_direction')
		if ordering and direction == 'desc':
			ordering = ['-'+x for x in ordering]
		if ordering:
			f_ordering = []
			for o in ordering:
				if not o:
					continue
				if o[0] == '-':
					f_ordering.append(F(o[1:]).desc(nulls_last=True))
				else:
					f_ordering.append(F(o).asc(nulls_last=True))
			return queryset.order_by(*f_ordering)
		return queryset

class BoardgameView(generics.ListAPIView):
	model = Boardgame
	queryset = Boardgame.objects.all()
	ordering = ['-bayes_average_rating']
	ordering_fields = ['bayes_average_rating','average_rating','average_weight','num_ratings',
		'year_published','wishing','owned','playing_time']
	filter_backends = (filters.DjangoFilterBackend,NullLastOrderingFilter,)
	filterset_class = BoardgameFilter
	serializer_class = BoardgameSerializer
	pagination_class = CustomPagination

class MechanicView(viewsets.ModelViewSet):
	serializer_class = MechanicSerializer
	queryset = Mechanic.objects.all()

class CategoryView(viewsets.ModelViewSet):
	serializer_class = CategorySerializer
	queryset = Category.objects.all()

class DesignerView(generics.ListAPIView):
	model = Designer
	serializer_class = DesignerSerializer
	queryset = Designer.objects.all()
	filter_backends = (filters.DjangoFilterBackend,NullLastOrderingFilter,)
	pagination_class = CustomPagination

class ArtistView(generics.ListAPIView):
	model = Artist
	serializer_class = ArtistSerializer
	queryset = Artist.objects.all()
	filter_backends = (filters.DjangoFilterBackend,NullLastOrderingFilter,)
	pagination_class = CustomPagination

class PublisherView(generics.ListAPIView):
	model = Publisher
	serializer_class = PublisherSerializer
	queryset = Publisher.objects.all()
	filter_backends = (filters.DjangoFilterBackend,NullLastOrderingFilter,)
	pagination_class = CustomPagination

