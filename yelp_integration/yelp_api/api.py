import requests

# Defining function "search_cafes" that performs a search for cafes using the Yelp API

def search_cafes(location, offset=0):

    # URL for the Yelp API endpoint used for searching businesses
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

    #requests.get functions sends a HTTP get request to the Yelp API endpoint
    response = requests.get(url, headers=headers, params=params)

    #We store the response in a python dictionary
    data = response.json()
    return data

