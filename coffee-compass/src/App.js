import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
import Store from '../src/context/Store';
import Header from '../src/components/Header'
import BackgroundPicture from "./components/BackgroundPicture";
import Organization from "./components/Organization";
import Legal from "./components/Legal";
import Property from "./components/Property";
import FeedBack from "./components/FeedBack";
import Service from "./components/Service";
import SideContent from "./components/SideContent";
import OrganizationPicture from "./components/OrganizationPicture";
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Header isMenuOpen={isMenuOpen} onMenuClick={handleMenuClick} />
      <BackgroundPicture />
        <Service/>
        <SideContent/>

        <Legal/>
        <Property/>
        <Organization/>
        <OrganizationPicture/>
        <FeedBack/>
    </div>
  );
}

export default App;

