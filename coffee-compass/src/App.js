import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map from './components/Map';
import Store from '../src/context/Store';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import Welcome from './components/Welcome';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';


// add components to website

//wrapping map in store allows map to access that context

// Put store in function App means we'll perform the actions in Store.js on page load (call Django API)


const steps = [
  {
  target: ".row",
  content:  "This tool allows you to see busyness at different times. Use the slider to change the time.",
  disableBeacon: true, //start on run
},
{
  target: ".test22",
  content: "The label will change based on the slider position and time frame selected.",
},
{
  target: ".filter_row",
  content: "Change the time scale to see busyness over the past day, week, or year.",
},
{
  target: ".legend",
  content: "The legend is currently showing us busyness. Colors near 0 are less busy, colors near 1 are more busy. For cafe owners, darker is better.",
},
{
  target: ".formgroup",
  content: "These buttons allow you to filter your heatmap. From top to bottom you have Busyness, Crime, Property Price, Transit Links, and Cafe Density",
},
{ 
  target: ".buttonSuggestion",
  content: "Click here to see the best zones to open a coffee shop based on your selections.",
},
{
  target: '.filter-nav',
  content: 'These buttons add markers to the map. Click on a button to see the corresponding markers on the map.',
},
{
  target: ".takeOutButton",
  content: "Click this button to see delivery radiuses based on the mode of transport and time.",
},
{
  target: ".map-container",
  content: "Click on a zone on the map to see aditional information about the zone. ",
},]

const takeOutSteps = [
{
  target: ".takeout-box-container",
  content: "These buttons allow you to customize your takeaway radius. This will show you how far you can travel in a given time and mode of transport",
  disableBeacon: true, //start on run
},
{
  target: ".mode-option",
  content: "Click here  to switch between your mode of transport (walking, cycling, or driving).",
},
{
  target: ".duration-option",
  content: "Click here to change the duration of your takeaway radius.",
},
{
  target: ".exit-option",
  content: "Click here to remove a marker from the map.",
},
{
  target: ".submit-button",
  content: "Click here to add a custom marker to the map.",
},
]

function App() {
  const [run, setRun] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [runTakeOut, setRunTakeOut] = useState(false); 

    // Function to start the Joyride tour


  return (
    <>
    {/* <Welcome/> */}
      <Joyride 
        steps={steps}
        continuous={true} 
        showSkipButton={true}
        run={run}
        styles = {{
          options: {
            backgroundColor: "#1f1f1f",
            primaryColor: "#1f1f1f",
            textColor: "#fff",
          },
        }}
        />  

    {run && <Joyride 
        steps={takeOutSteps}
        continuous={true} 
        showSkipButton={true}
        run={runTakeOut}
        styles = {{
          options: {
            backgroundColor: "#1f1f1f",
            primaryColor: "#1f1f1f",
            textColor: "#fff",
          },
        }}
      /> }
      
      <div>
       {showWelcome && <Welcome setShowWelcome = {setShowWelcome} setRun = {setRun}/>  }
      <Store>
        <Map setRun =  {setRun} setRunTakeOut = {setRunTakeOut} />
      </Store>
    </div>
    </>
  );
}
export default App;
