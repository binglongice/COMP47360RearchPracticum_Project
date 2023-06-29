from django.shortcuts import render
from django.http import JsonResponse
from django.core.cache import cache
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

    cache_key = f'cafes_{location}'  # Unique cache key based on the location
    
    # Check if the data is already cached
    data = cache.get(cache_key)
    print(data)
    if data is not None:
        return Response(data)
    
    limit = 20
    cafes = Cafe.objects.all()
    print (cafes.count())

    #limit = 20
    #offset = 0
    #total_cafes = 0
    #cafes = []


    #filter(location=location)  # Query the stored cafes in the database

    if not cafes or cafes.count() != limit: # If cafes for the location are not stored in the databse

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

        Cafe.objects.all().delete()   
        Cafe.objects.bulk_create(cafes) # store fetched cafes in the database

        # Cache the data for future requests
        cache.set(cache_key, data)
        print(cache)
        
    
    serializer = CafeSerializer(cafes, many=True)
    return Response(serializer.data)
