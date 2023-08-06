import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
import Store from '../src/context/Store';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';


// add components to website

//wrapping map in store allows map to access that context

// Put store in function App means we'll perform the actions in Store.js on page load (call Django API)

//joyride steps
// const initialStepsList = [
//   {
//     target: ".BusynessSliderBox",
//     content: "This tool allows you to see busyness at different times.",
//     disableBeacon: true, //start on page load
//   },
//   {
//     target: ".row",
//     content: "Move the slider to change the time of day.",
//   },
//   {
//     target: ".filter_row",
//     content: "Change the time scale to see busyness over the past day, week, or year.",
//   },
//   {
//     target: ".legend",
//     content: "This legend shows the busyness scale. Colors near 0 are less busy, colors near 1 are more busy.",
//   },
//   {
//     target: ".HeatMapButton",
//     content: "Click this button to further customize your heatmap options. Go ahead and click it now",
//   },

// ]


// const additionalStep = {
//   target: ".HeatMapBox",
//   content: "Select the options you want to see on your heatmap. The heatmap will update automatically based on your selections. Under the hood we have a rank assigned to each zone for each category and these ranks are combined when selecting multiple categories. ",
//   disableBeacon: true, //start on page load
// };

// const extraSteps = [
//   {
//     target: ".buttonSuggestion",
//     content: "Click This to see the best zones to open a coffee shop based on your selections."
//   },
//   {
//     target: ".filter-nav",
//     content: "Click on the icons to add markers to the map."
//   },
//   {
//     target: ".map-container",
//     content: "Click on a zone on the map to see aditional information about the zone. ",
//   },
// ]

function App() {
  // const [initialSteps, setInitialSteps] = useState(initialStepsList);
  // const [steps, setSteps] = useState(initialSteps);
  // const [run, setRun] = useState(true);
  // const joyrideRef = useRef();

  // const handleJoyrideCallback = data => {
  //   const { status } = data;
  //   if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
  //     // Need to set our running state to false, so we can restart if we click start again.
  //     setRun(false);
  //   }
  // };
  // const [count, setCount] = useState(0);  // Declare count with useState
  // const addNextStep = () => {
  //   if (count === 0) {
  //     let newSteps = [additionalStep].concat(extraSteps);
  //     setSteps(newSteps);
  //     setRun(true);
  //     setCount(count + 1); // Increase count
  //   }
  // };
  return (
    <>
      {/* <Joyride 
        ref={joyrideRef}
        callback={handleJoyrideCallback}
        run={run}
        steps={steps}
        continuous={true} 
        showSkipButton={true}
        styles = {{
          options: {
            backgroundColor: "#1f1f1f",
            primaryColor: "#1f1f1f",
            textColor: "#fff",
          },
        }}
        // styles={{
        //   options: {
        //     arrowColor: "#1f1f1f",
        //     backgroundColor: "#1f1f1f",
        //     overlayColor: "rgba(50, 50, 50, 0.4)",
        //     primaryColor: "#1f1f1f",
        //     textColor: "#fff",
        //   },
        //   spotlight: {
        //     backgroundColor: "transparent",
        //   },
        // }}
      />  
       */}
      <div>
      <Store>
        <Map/>
      </Store>
    </div>
    </>
  );
}
export default App;
