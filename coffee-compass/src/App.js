import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';



function App() {
  // useEffect(() => {
  //   const term = 'cafes'; // Set your desired term
  //   const location = 'Manhattan'; // Set your desired location

  //   searchCafes(term, location)
  //     .then(data => {
  //       console.log(data); // Log the fetched data
  //     })
  //     .catch(error => {
  //       console.error(error); // Handle error
  //     });
  // }, []);


  return (

      <div>
          <Map />
      </div>
    );
}
export default App;
