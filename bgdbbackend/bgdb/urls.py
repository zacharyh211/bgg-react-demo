
from django.urls import path, include
import bgdb.views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'mechanics', bgdb.views.MechanicView, 'mechanics')
router.register(r'categories', bgdb.views.CategoryView, 'categories')

urlpatterns = [
    path('search/', include(router.urls)),
    path('search/boardgames', bgdb.views.BoardgameView.as_view(), name='boardgames'),
    path('search/designers', bgdb.views.DesignerView.as_view(), name='designers'),
    path('search/publishers', bgdb.views.PublisherView.as_view(), name='publishers'),
    path('search/artists', bgdb.views.ArtistView.as_view(), name='artists'),
]
