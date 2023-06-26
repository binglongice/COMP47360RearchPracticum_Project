from django.urls import path
from .views import search_restaurants_view

urlpatterns = [
    path('search/', search_restaurants_view, name='search_restaurants'),
]
