import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapContext from '../context/MapContext';
import customMarkerImage from '../coffee.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWalking, faBicycle, faCar } from '@fortawesome/free-solid-svg-icons';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

const TakeOutBox = ({ setProfile, setMinutes, setTakeoutLat, setTakeoutLng }) => {
    const map = useContext(MapContext); // Get the map instance

    const [modeIndex, setModeIndex] = useState(0); // Track the current index of the mode options
    const [durationIndex, setDurationIndex] = useState(0); // Track the current index of the duration options

    const modeOptions = [
        { icon: faWalking, value: 'walking' },
        { icon: faBicycle, value: 'cycling' },
        { icon: faCar, value: 'driving' },
    ];

    const durationOptions = ['10', '20', '30'];

    useEffect(() => {
        return () => {
            // Cleanup on unmount: remove the event listener
            if (map) map.off('click', onMapClick);
        };
    }, []);

    const onMapClick = (e) => {
        const marker = document.querySelector('.mapboxgl-marker');
        if (marker) {
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

        setTakeoutLat(lat);
        setTakeoutLng(lng);

        // After placing the marker, remove the event listener
        map.off('click', onMapClick);
    };

    const handleModeChange = () => {
        setModeIndex((prevIndex) => (prevIndex + 1) % modeOptions.length);
        const selectedMode = modeOptions[modeIndex].value;
        setProfile(selectedMode);
    };

    const handleDurationChange = () => {
        setDurationIndex((prevIndex) => (prevIndex + 1) % durationOptions.length);
        const selectedDuration = durationOptions[durationIndex];
        setMinutes(selectedDuration);
    };

    const createMarker = () => {
        if (map) map.on('click', onMapClick);
    };

    return (
        <div className='takeout-box-container'>
            <form id='params'>
                <h4 className='mode-selection-header'>Choose a travel mode:</h4>
                <div className='mode-selection-options'>
                    <button className='mode-option' onClick={handleModeChange}>
                        <FontAwesomeIcon icon={modeOptions[modeIndex].icon} />
                    </button>
                </div>
                <h4 className='duration-selection-header'>Choose a maximum duration:</h4>
                <div className='duration-selection-options'>
                    <button className='duration-option' onClick={handleDurationChange}>
                        {durationOptions[durationIndex]}
                    </button>
                </div>
                <div className='button-container'>
                    <button className='submit-button' type='button' onClick={createMarker}>
                        +
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TakeOutBox;
