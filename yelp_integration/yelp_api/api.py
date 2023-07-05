import requests


def search_cafes(location, offset=0):
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
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    return data
