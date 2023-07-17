import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';

function Store({ children, selectedCafeId }) {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [picklePredictions, setPicklePredictions] = useState([]);
  const location = 'Manhattan';

  //API fetch request via axios
  //Used to interact with Django endpoint - using GET request
  const fetchData = () => {
    console.log('Before calling getCafesByLocation');
    return axios
      .get(`http://127.0.0.1:8000/yelp_api/api/cafes/${location}/`)
      .then((response) => {
        const responseData = response.data;
        console.log('Received data:', responseData);
        setData(responseData); //Saves data as response data (from Django db) - returned API data
        return responseData;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const fetchReviews = (id) => {
    return axios
      .get(`http://127.0.0.1:8000/yelp_api/api/reviews/${id}/`)
      .then((response) => {
        const reviewData = response.data;
        console.log('Received reviews:', reviewData);
        setReviews(reviewData);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  useEffect(() => {
    fetchData().catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    if (selectedCafeId) {
      fetchReviews(selectedCafeId).catch((error) => {
        console.log(error);
      });
    }
  }, [selectedCafeId]);

  //new useEffect for model predictions - CURRENTLY HARDCODED - seems to be logging twice
  //Hour, Day, Month, Week_of_Month 
  //0-23, 0-6, 1-12, 0-4
  useEffect(() => {
    fetch('http://localhost:8000/yelp_api/pickle_views/model-output/11/3/9/2/')
      .then(response => response.json())
      .then(data => {
        // Access the predictions data here
        // console.log('new state for predictions', data);
        // setPicklePredictions(data.predictions)
        // console.log('new state for predictions', picklePredictions)
        // Use the data to generate the heatmap or perform other operations
        // ...
        // Convert the data into a hashmap (object)
        const hashmap = {};
        Object.keys(data).forEach((key) => {
          hashmap[key] = data[key][0];
          });
        // console.log("Test Test TEst", hashmap);
        console.log("testing hashmap:", hashmap[4]);
        setPicklePredictions(hashmap);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
  

  return (
    <ApiContext.Provider value={[data, setData, reviews, setReviews, picklePredictions, setPicklePredictions]}>
      {children}
    </ApiContext.Provider>
  );
}
export default Store;
