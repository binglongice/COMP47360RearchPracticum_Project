import requests


def search_cafes(location, offset=0):
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': 'Bearer TRtXaSCAEFNFdy0ku-9lmcLqu3Vt5zg35kr5aXt1Z8lbIwtWb66_2IlwSXb6FgGHuo-TzW3AloRihfCHYwK9x3z46frCQotstsWvsVfYBLtSx8hiPiii8qqYTgqbZHYx',
    }
    params = {
        'location': location,
        'categories': 'cafes',
        'limit': 50,
        "offset": offset,
        #'offset': offset,  # Add the offset parameter
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    return data

import requests

def get_reviews(id):
    url = f'https://api.yelp.com/v3/businesses/{id}/reviews'
    headers = {
        'Authorization': 'Bearer TRtXaSCAEFNFdy0ku-9lmcLqu3Vt5zg35kr5aXt1Z8lbIwtWb66_2IlwSXb6FgGHuo-TzW3AloRihfCHYwK9x3z46frCQotstsWvsVfYBLtSx8hiPiii8qqYTgqbZHYx',
    }
    
    response = requests.get(url, headers=headers)
    review_data = response.json()
    return review_data

