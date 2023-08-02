import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapContext from '../context/MapContext';
import customMarkerImage from '../coffee.png';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';
// we might use a different mapbox api key so we don't go over 

// Import your custom marker image

//https://docs.mapbox.com/help/tutorials/get-started-isochrone-api/


const TakeOutBox = ({setProfile, setMinutes, setTakeoutLat, setTakeoutLng}) => {
    const map = useContext(MapContext); // Get the map instance
    
    const handleProfileChange = (e) => {
        setProfile(e.target.value);
    };

    const handleDurationChange = (e) => {
        setMinutes(e.target.value);
    };

    useEffect(() => {
        return () => {
            // Cleanup on unmount: remove the event listener
            if (map) map.off('click', onMapClick);
        };
    }, []);

    const onMapClick = (e) => {
        const marker = document.querySelector('.mapboxgl-marker');
        if (marker) {
            map.on('click', onMapClick); 
            marker.remove();  
        }



        const { lng, lat } = e.lngLat;


        // Create a new marker and add it to the map
        const customMarkerElement = document.createElement('img');
        customMarkerElement.src = customMarkerImage;
        customMarkerElement.classList.add('custom-marker');
    
        new mapboxgl.Marker({ element: customMarkerElement }) // Use the custom marker element
            .setLngLat([lng, lat])
            .addTo(map);
            console.log("takeout coords", lng,lat)
        //check to see if a marker exists, if it does, remove it
        setTakeoutLat(lat);
        setTakeoutLng(lng);

        // After placing the marker, remove the event listener
        map.off('click', onMapClick);
    };

    const createMarker = () => {
        
        if (map) map.on('click', onMapClick);
        
    };
    
    return (
        <div className='takeout-box-container'>
            <form id='params'>
                <h4 className='mode-selection-header'>Choose a travel mode:</h4>
                <div className='mode-selection-options'>
                    <label className='mode-option'>
                        <input name='profile' type='radio' value='walking' onChange={handleProfileChange} />
                        <div className='mode-label'>Walking</div>
                    </label>
                    <label className='mode-option'>
                        <input name='profile' type='radio' value='cycling' onChange={handleProfileChange} />
                        <div className='mode-label'>Cycling</div>
                    </label>
                    <label className='mode-option'>
                        <input name='profile' type='radio' value='driving' onChange={handleProfileChange}/>
                        <div className='mode-label'>Driving</div>
                    </label>
                </div>
                <h4 className='duration-selection-header'>Choose a maximum duration:</h4>
                <div className='duration-selection-options'>
                    <label className='duration-option'>
                        <input name='duration' type='radio' value='10' onChange={handleDurationChange} />
                        <div className='duration-label'>10 min</div>
                    </label>
                    <label className='duration-option'>
                        <input name='duration' type='radio' value='20' onChange={handleDurationChange}/>
                        <div className='duration-label'>20 min</div>
                    </label>
                    <label className='duration-option'>
                        <input name='duration' type='radio' value='30' onChange={handleDurationChange}/>
                        <div className='duration-label'>30 min</div>
                    </label>
                </div>
                <div className="button-container">
                    <button className="submit-button" type="button" onClick={createMarker}>Create a Marker</button>
                </div>

            </form>
        </div>
    );
};

export default TakeOutBox;
