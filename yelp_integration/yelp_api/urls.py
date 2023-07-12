#from django.urls import path
#from .views import search_restaurants_view

#urlpatterns = [
#    path('search/', search_restaurants_view, name='search_restaurants'),
#]

from django.urls import path
from .views import cafes_api, review_api

urlpatterns = [
    path('api/cafes/<str:location>/', cafes_api, name='cafes_api'),
    path('api/reviews/<str:id>/', review_api)
]
#