import axios from 'axios';

const location = 'Manhattan'; 

export const getCafesByLocation = (location) => {
  return axios.get(`/api/cafes/${location}/`)
    .then(response => {
      // Handle the successful response
      return response.data;
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      throw error;
    });
};