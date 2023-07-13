#from django.urls import path
#from .views import search_restaurants_view

#urlpatterns = [
#    path('search/', search_restaurants_view, name='search_restaurants'),
#]

from django.urls import path
from .views import cafes_api
from . views import predictions_api, review_api
#this needs to be modified in dev
urlpatterns = [
    path('api/cafes/<str:location>/', cafes_api, name='cafes_api'),
    path('api/reviews/<str:id>/', review_api),
    path('api/predictions/<str:location>/', predictions_api, name='predictions_api'),
    
]
