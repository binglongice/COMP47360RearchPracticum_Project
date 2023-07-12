import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
import Store from '../src/context/Store';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function App() {
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  console.log('selectedCafeId:', selectedCafeId);
  return (
    <div>
      <Store selectedCafeId={selectedCafeId}>
        <Map onCafeSelection={setSelectedCafeId} />
      </Store>
    </div>
  );
}export default App;
