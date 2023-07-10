import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';

function Store({ children }) {
  const [data, setData] = useState([]);
const neighborhoods = [
  'Battery Park City, Manhattan',
  'Carnegie Hill, Manhattan',
  'Chelsea, Manhattan',
  'Chinatown, Manhattan',
  'East Harlem, Manhattan',
  'East Village, Manhattan',
  'Financial District, Manhattan',
  'Flatiron District, Manhattan',
  'Garment District, Manhattan',
  'Gramercy Park, Manhattan',
  'Greenwich Village, Manhattan',
  'Harlem, Manhattan',
  'Hell\'s Kitchen, Manhattan',
  'Inwood, Manhattan',
  'Kips Bay, Manhattan',
  'Lenox Hill, Manhattan',
  'Lincoln Square, Manhattan',
  'Little Italy, Manhattan',
  'Lower East Side, Manhattan',
  'Manhattan Valley, Manhattan',
  'Meatpacking District, Manhattan',
  'Midtown Manhattan, Manhattan',
  'Morningside Heights, Manhattan',
  'Murray Hill, Manhattan',
  'NoHo, Manhattan',
  'Nolita, Manhattan',
  'Roosevelt Island, Manhattan',
  'SoHo, Manhattan',
  'Stuyvesant Town, Manhattan',
  'Sutton Place, Manhattan',
  'Theater District, Manhattan',
  'Tribeca, Manhattan',
  'Tudor City, Manhattan',
  'Turtle Bay, Manhattan',
  'Upper East Side, Manhattan',
  'Upper West Side, Manhattan',
  'Washington Heights, Manhattan',
  'West Village, Manhattan',
  'Yorkville, Manhattan'
];
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

  useEffect(() => {
    fetchData().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <ApiContext.Provider value={[data, setData]}>
      {children}
    </ApiContext.Provider>
  );
}

export default Store;
