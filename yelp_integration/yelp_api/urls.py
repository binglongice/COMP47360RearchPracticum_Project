#from django.urls import path
#from .views import search_restaurants_view

#urlpatterns = [
#    path('search/', search_restaurants_view, name='search_restaurants'),
#]

from django.urls import path
from .views import cafes_api

urlpatterns = [
    path('api/cafes/<str:location>/', cafes_api, name='cafes_api'),
]

# Any request with a URL matching the pattern api/cafes/<location>/ will be routed to the cafes_api view function. 
# The captured location parameter will be passed as an argument to the view function.

#api/cafes/new-york/ This will retrieve cafes in New York.
#api/cafes/paris/ This will retrieve cafes in Paris.
# Doesn't seem to work that way?