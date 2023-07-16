<<<<<<< HEAD:backend/yelp_api/urls.py
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
=======
#from django.urls import path
#from .views import search_restaurants_view

#urlpatterns = [
#    path('search/', search_restaurants_view, name='search_restaurants'),
#]

from django.urls import path
from .views import cafes_api
from . views import predictions_api, review_api
from .pickle_views import model_output_api
#this needs to be modified in dev

urlpatterns = [
    path('api/cafes/<str:location>/', cafes_api, name='cafes_api'),
    path('api/reviews/<str:id>/', review_api),
    path('api/predictions/<str:location>/', predictions_api, name='predictions_api'),
    path('pickle_views/model-output/<int:hour>/<int:day>/<int:month>/<int:week_of_month>/', model_output_api, name='model-output-api'),
]
>>>>>>> 5805d160676c91309751644630a9dd6e8ab6aefe:yelp_integration/yelp_api/urls.py
