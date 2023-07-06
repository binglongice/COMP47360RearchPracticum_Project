import axios from 'axios';
import {useEffect, useContext} from 'react';

// const location = 'Manhattan';

// export const getCafesByLocation = (location) => {
//   return axios.get(`http://127.0.0.1:8000/yelp_api/api/cafes/${location}/`)
//     .then(response => {
//       console.log(response.data); // Log the data to the console
//       return response.data;
//     })
//     .catch(error => {
//       console.error(error);
//       throw error;
//     });
// };

// export function fetchData() {
//   console.log('Before calling getCafesByLocation');
//   return getCafesByLocation(location)
//     .then(data => {
//       console.log('Received data:', data);
//       return data;
//     })
//     .catch(error => {
//       console.error(error);
//       throw error;
//     });
// }


