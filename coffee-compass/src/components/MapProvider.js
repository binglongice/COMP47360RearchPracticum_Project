import React, { useState } from 'react';
import MapContext from './MapContext';

const MapProvider = ({ children }) => {
    //define states here








    //define functions here

    const initializeMap = () => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
            minZoom: zoom,
            maxBounds: bounds,
            pitch: pitch,
            
            });
    }
      
      





    return (
        <MapContext.Provider value={{
            //export states and functions here
            
        }}>
            {children}
        </MapContext.Provider>

    )
}
export default MapProvider;