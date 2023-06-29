from django.shortcuts import render
from django.http import JsonResponse
#from .api import search_cafes

"""def search_restaurants_view(request):
    
    location = "Manhattan"
    results = search_restaurants(location)
    return JsonResponse(results)"""


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .api import search_cafes
from .models import Cafe
#from yelp_integration import search_cafes


from .serializers import CafeSerializer

@api_view(['GET'])
def cafes_api(request, location):

    
    #cafes = Cafe.objects.filter(location=location)  # Query the stored cafes in the database

    data = search_cafes(location)
    cafes = []
    for cafe_data in data.get('businesses', []):
        cafe = Cafe(
            name=cafe_data['name'],
            address=cafe_data['location']['address1'],
            rating=cafe_data['rating'],
            latitude=cafe_data['coordinates']['latitude'],
            longitude=cafe_data['coordinates']['longitude'],
        )
        cafes.append(cafe)
    serializer = CafeSerializer(cafes, many=True)
    return Response(serializer.data)
