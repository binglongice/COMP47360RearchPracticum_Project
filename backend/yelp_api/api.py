import requests

# Defining function "search_cafes" that performs a search for cafes using the Yelp API

def search_cafes(location, offset=0):

    # URL for the Yelp API endpoint used for searching businesses
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': 'Bearer Lb5tEP0itSVkN0E6P8MeLvQYRuPw5uQKTDkrmbyvVGueym5b8Sas2GyMWSHBHQKoyTs0Wp9PqzKdUw4UGHBZIGM9y_77mDKOqv15nQW7E8sYIC4LFWeH39Z9rkOjZHYx',
    }
    params = {
        'location': location,
        'categories': 'cafes',
        'limit': 50,
        "offset": offset,
        #'offset': offset,  # Add the offset parameter
    }

    #requests.get functions sends a HTTP get request to the Yelp API endpoint
    response = requests.get(url, headers=headers, params=params)

    #We store the response in a python dictionary
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

