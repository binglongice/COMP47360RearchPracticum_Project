import requests

def search_restaurants(location):
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': 'Bearer IQuA3KpE_M1B77QUHXQZ_OenMn_QL7szzkV_pdngYOnkXoBrVrMTRGmL2Qicq8yJC-m2vEHM6EUSLrUcoE1L7Rgl9mMETsxS1F1WWB49Y2n9PZJo13n-ziM4bLWRZHYx',
    }
    params = {
        'location': location,
        'categories': 'cafe',
        'price': 4,
        'limit': 10,
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
