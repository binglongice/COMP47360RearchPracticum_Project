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
from .serializers import Cafe_DB_Serializer

@api_view(['GET'])
def cafes_api(request, location):

    # Check if the database already contains 1000 objects
    if Cafe.objects.count() == 1000:
        cafes_list = Cafe.objects.all()
        serializer = Cafe_DB_Serializer(cafes_list, many=True)
        return Response(serializer.data)

    #cache_key = f'cafes_{location}'  # Unique cache key based on the location
    
    # Check if the data is already cached
    #data = cache.get(cache_key)
    #print("cached data,", data)
    #if data is not None:
    #    return Response(data)
    

    cafes = Cafe.objects.all()
    print ("Cafes in database", cafes.count())

    limit = 50
    offset = 0
    total_cafes = 0
    cafes_list = []


    #filter(location=location)  # Query the stored cafes in the database

    #if not cafes or cafes.count() != limit: # If cafes for the location are not stored in the databse

    while total_cafes < 1000:
        data = search_cafes(location, offset=offset)
        businesses = data.get('businesses', [])
        cafes_list.extend(businesses)
        total_cafes += len(businesses)
        offset += limit
        
        if len(businesses) < limit:
            break

    Cafe.objects.all().delete()

    # Store fetched cafes in the database
    for cafe_data in cafes_list:
        cafe = Cafe(
            name=cafe_data['name'],
            address=cafe_data['location']['address1'],
            rating=cafe_data['rating'],
            latitude=cafe_data['coordinates']['latitude'],
            longitude=cafe_data['coordinates']['longitude'],
        )

        cafe.save()

    # Cache the data for future requests
    #cache.set(cache_key, data, timeout=3600)
    
    serializer = CafeSerializer(cafes_list, many=True)
    return Response(serializer.data)