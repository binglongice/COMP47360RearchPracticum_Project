import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';

function Store({ children, selectedCafeId }) {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const location = 'Manhattan';

  const fetchData = () => {
    console.log('Before calling getCafesByLocation');
    return axios
      .get(`http://127.0.0.1:8000/yelp_api/api/cafes/${location}/`)
      .then((response) => {
        const responseData = response.data;
        console.log('Received data:', responseData);
        setData(responseData);
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

  return (
    <ApiContext.Provider value={[data, setData, reviews, setReviews]}>
      {children}
    </ApiContext.Provider>
  );
}
export default Store;
