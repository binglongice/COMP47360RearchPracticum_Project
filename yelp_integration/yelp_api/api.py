import requests


def search_cafes(location):
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': 'Bearer TRtXaSCAEFNFdy0ku-9lmcLqu3Vt5zg35kr5aXt1Z8lbIwtWb66_2IlwSXb6FgGHuo-TzW3AloRihfCHYwK9x3z46frCQotstsWvsVfYBLtSx8hiPiii8qqYTgqbZHYx',
    }
    params = {
        'location': location,
        'categories': 'cafes',
        'limit': 20,
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    return data

