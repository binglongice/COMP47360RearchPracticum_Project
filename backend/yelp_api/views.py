from django.shortcuts import render
from django.http import JsonResponse
from django.core.cache import cache



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .api import search_cafes, get_reviews
from .models import Cafe
from .models import Predictions
#from yelp_integration import search_cafes


from .serializers import CafeSerializer
from .serializers import Cafe_DB_Serializer
from .serializers import PredictionsSerializer
# The cafes_api function takes two parameters: request and location. 
# request is the incoming HTTP request object, and location is a parameter extracted from the URL.


from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination

@api_view(['GET'])
def predictions_api(request, location):
    # Retrieve predictions from the database
    predictions_list = Predictions.objects.all()

    # Configure pagination
    paginator = Paginator(predictions_list, 100)  # Adjust the page size as needed
    page = request.GET.get('page')
    predictions_page = paginator.get_page(page)

    # Serialize the paginated data
    serializer = PredictionsSerializer(predictions_page, many=True)

    # Return paginated response
    return Response({
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'results': serializer.data
    })



@api_view(['GET'])
def cafes_api(request, location):

    # Check if the database already contains 1000 objects, if so retrieve them from DB, 
    #  serializes the data using the Cafe_DB_Serializer, and returns a Response with the serialized data.
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
    
    # If there are not 1000 cafes, it uses the Yelp API to fetch cages in batches in 50 
    # up until the limit of 1000

    #Fetched cafes are stored in the cafes_list variable
    
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

    # Store fetched cafes in the database - having deleted old cafes?
    for cafe_data in cafes_list:
        cafe = Cafe(
            id=cafe_data['id'],
            name=cafe_data['name'],
            address=cafe_data['location']['address1'],
            rating=cafe_data['rating'],
            latitude=cafe_data['coordinates']['latitude'],
            longitude=cafe_data['coordinates']['longitude'],
            image_url = cafe_data['image_url'],
        )

        cafe.save()


    # QUESTION: Will the result in the same 1000 each time? e.g. first 1000?

    # Cache the data for future requests
    #cache.set(cache_key, data, timeout=3600)

    # Serialiser variable is created by instantiating the cafe serialiser class
    # many=True indicates that the serializer should handle a list of objects rather than a single object. 
    # This is because cafes_list contains multiple cafes
        
    serializer = CafeSerializer(cafes_list, many=True)

    # Response object is created using Response(serializer.data), which wraps the serialized data. 
    # This response is returned from the view function and will be sent back to the client as the HTTP response.
    return Response(serializer.data)



@api_view(['GET'])
def review_api(requests, id):
    data = get_reviews(id)
    return Response(data)
