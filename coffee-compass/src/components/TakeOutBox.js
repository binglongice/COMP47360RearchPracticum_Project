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

    const [modeIndex, setModeIndex] = useState(0);
    const [durationIndex, setDurationIndex] = useState(0);
    const [mapClickActive, setMapClickActive] = useState(false);

    const modeOptions = [
        { icon: faWalking, value: 'walking' },
        { icon: faBicycle, value: 'cycling' },
        { icon: faCar, value: 'driving' },
    ];

    const durationOptions = ['10m', '20m', '30m'];

    useEffect(() => {
        setProfile(modeOptions[modeIndex].value);
    }, [modeIndex]); // Set mode whenever modeIndex changes

    useEffect(() => {
        setMinutes(durationOptions[durationIndex]);
    }, [durationIndex]); // Set duration whenever durationIndex changes

    useEffect(() => {
        if (mapClickActive) {
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

                new mapboxgl.Marker({ element: customMarkerElement })
                    .setLngLat([lng, lat])
                    .addTo(map);

                setTakeoutLat(lat);
                setTakeoutLng(lng);

                setMapClickActive(false); // Deactivate map click after marker placement
            };

            map.on('click', onMapClick);

            return () => {
                // Cleanup on unmount: remove the event listener
                map.off('click', onMapClick);
            };
        }
    }, [mapClickActive]); // Run this effect whenever mapClickActive changes

    const handleModeChange = () => {
        setModeIndex((prevIndex) => (prevIndex + 1) % modeOptions.length);
    };

    const handleDurationChange = () => {
        setDurationIndex((prevIndex) => (prevIndex + 1) % durationOptions.length);
    };

    const createMarker = () => {
        setMapClickActive(true); // Activate map click for marker placement
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
                        Create a Marker
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TakeOutBox;
