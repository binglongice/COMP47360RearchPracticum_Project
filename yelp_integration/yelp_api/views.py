from django.shortcuts import render
from django.http import JsonResponse
from .api import search_restaurants

def search_restaurants_view(request):
    
    location = "Manhattan"
    results = search_restaurants(location)
    return JsonResponse(results)

