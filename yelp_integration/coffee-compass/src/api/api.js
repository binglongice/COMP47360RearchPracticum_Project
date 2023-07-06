import axios from 'axios';

export const getCafesByLocation = (location) => {
  return axios.get(`http://127.0.0.1:8000/yelp_api/api/cafes/${location}/`)
    .then(response => {
      console.log(response.data); // Log the data to the console
      // Handle the successful response
      return response.data;
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      throw error;
    });
};

console.log('Before calling getCafesByLocation');
getCafesByLocation('Manhattan')
  .then(data => {
    console.log('Received data:', data);
    // Handle the received data
  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });
console.log('After calling getCafesByLocation');
