import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
import Store from '../src/context/Store';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';


// add components to website

//wrapping map in store allows map to access that context

// Put store in function App means we'll perform the actions in Store.js on page load (call Django API)

function App() {

  return (

      <div>
        <Store> 
          <Map />
        </Store>
      </div>
    );
}
export default App;
