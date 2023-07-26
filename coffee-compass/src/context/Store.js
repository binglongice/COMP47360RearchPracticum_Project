import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';



// Need to pass in current date
const getFormattedDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const month = today.getMonth() + 1; // 1 (January) to 12 (December)

  // Calculate the week_of_year based on the date
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  return `${dayOfWeek}/${month}/${weekOfYear}`;
};


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
  //Day, Month, Week_of_Year 
  //0-6, 1-12, 0-52
  useEffect(() => {
    const todayDate = getFormattedDate();
    console.log('input to 24 hour API - day/month/week_of_year', todayDate);

    fetch(`http://localhost:8000/yelp_api/pickle_views/model-output/${todayDate}/`)
      .then(response => response.json())
      .then(data => {
        // Access the predictions data here
        // Convert the data into a hashmap (object)
        console.log('API data', data);
        const hashmap = {};
        Object.keys(data).forEach(key => {
          hashmap[key] = data[key][0];
        });

        console.log("store keys", data.keys);
        console.log("testing hashmap:", hashmap["model_4"]);
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
