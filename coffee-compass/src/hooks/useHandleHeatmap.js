import { useState, useEffect } from 'react';

const useHandleHeatmap = (map, newGeoJson, activeMaps, mapIsCurrent, rankedGeoJson, createHeatMap) => {

  const [activeMapsState, setActiveMapsState] = useState(activeMaps);

  useEffect(() => {
    if (newGeoJson) {
      handleHeatMap(activeMaps);
    }
  }, [newGeoJson]);

  const handleHeatMap = (activeMaps) => {
    setActiveMapsState(activeMaps);
  
    if (map.getLayer("taxi_zones_fill_map")) {
      map.removeLayer("taxi_zones_fill_map");
    }
  
    if (activeMaps) {
      const activeCount = Object.values(activeMaps).filter(val => val).length;
        
      if (activeCount > 1 && newGeoJson) {
        if (mapIsCurrent && newGeoJson) {
          createHeatMap(newGeoJson, "current_color");
        }
      } else {
        handleIndividualHeatMap('busyness', "busyness_color");
        handleIndividualHeatMap('crimeData', "crime_color");
        handleIndividualHeatMap('prices', "prices_color");
      }
    }
  };

  const handleIndividualHeatMap = (heatMapType, color) => {
    if (activeMaps[heatMapType]) {
      console.log(`${heatMapType} is checked`);
      if (mapIsCurrent && newGeoJson) {
        createHeatMap(newGeoJson, color);
      }
    } else {
      console.log(`${heatMapType} is unchecked`);
    }
  }

  return handleHeatMap;
};

export default useHandleHeatmap;
