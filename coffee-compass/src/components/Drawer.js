import React, { useState, useEffect, useRef, useContext } from 'react';
import LineChart from './LineChart';
import { ApiContext } from '../context/ApiContext';


function Drawer ({getMap, rightSidebar, setRightSidebar, dayData, weekData, yearData, objectID, name, busynessRank, crimeRank, propertyRank, transitRank, combinedRank, cafeRank, cafeId, cafe_url, cafe_name, cafe_rating, cafeClick, setCafeClick, zoneInfo, zoneFlag, setZoneFlag, suggestionFlag}) {
    const sidebarRef = useRef(null);
    const {sortedCafes, reviews} = useContext(ApiContext);  
    const [selectedCafes, setSelectedCafes] = useState([]);
    const [averageCafe, setAverageCafe] = useState([]);

    //function that fetches reviews for a cafe if cafeID is not null

    //function that handles cafe selection
    //takes in the objectID of the cafe that was selected
    //creates a list of cafes with that objectID
    const handleCafeSelection = (objectID) => {
      let selectedCafe = [];
      sortedCafes.forEach(cafe => {
        if(cafe.objectid === objectID) {
          selectedCafe.push(cafe);
        }
      })
      //sort cafes by rating and assign to selectedCafe
      selectedCafe.sort((a,b) => {
        return b.rating - a.rating;
      })  
      setSelectedCafes(selectedCafe);
    }

    useEffect(() => {
      handleCafeSelection(objectID)
    }, [objectID])

    useEffect(() => {
      console.log('test test test', selectedCafes);
    }, [selectedCafes])

    useEffect(() => {
      if (zoneInfo) {

      console.log("zone info: ", zoneInfo)
      }
    }, [zoneInfo])
  

    // changes the padding of the map so the map moves to the left when the sidebar is open
    // and returns to its original position when its closed
    // smooth transition between the two states
    useEffect(() => {
        const map = getMap();
        // Now you have the latest value of the map
        // console.log("Map test", map);
    
        if (!map) {
            return;
        }
    
        if (rightSidebar) {
            const padding = { right: 300 };
            map.easeTo({
                padding: padding,
                duration: 1000
            });
        } else {
            const padding = { right: 0 };
            map.easeTo({
                padding: padding,
                duration: 1000
            });
        }
    }, [rightSidebar, getMap]);
    
    const toggleSidebar = (side) => {
        if (side === 'right') {
            setRightSidebar(!rightSidebar);
            setCafeClick(false);
        }
    };

    //function that averages the rating of all cafes in a zone
      useEffect(() => {
        if (sortedCafes.length > 0) {
          let total = 0;
          let count = 0;
          sortedCafes.forEach(cafe => {
            if (cafe.objectid === objectID) {
              total += Number(cafe.rating);
              count++;
            }
          })
          let average = total / count;
          setAverageCafe(average);
        }
      }, [sortedCafes,objectID])


      //returns zoneInfo information

      useEffect(() => {
        if (zoneInfo) {
        //for the length of zone info array, return the first element and then the second element...
        zoneInfo.forEach(zone => {
          let zoneName = zone.properties.zone;
          let zoneCrimeRank = zone.properties.crime_rank;
          let zoneBusynessRank = zone.properties.busyness_rank;
          let zonePropertyRank = zone.properties.prices_rank;
          let zoneTransitRank = zone.properties.transport_rank;
          let zoneCafeRank = zone.properties.cafe_rank;
          console.log("hi", zoneName, zoneCrimeRank, zoneBusynessRank, zonePropertyRank, zoneTransitRank, zoneCafeRank);
        })
      }
      }, [zoneInfo])
    
//using a ternerary operator to switch between three conditions
    return (
      rightSidebar ? (
        zoneFlag  ? (
        <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-content rounded-rect flex-center">
            <h1 className="sidebar-header">{name}</h1>
            <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
              &rarr;
            </div>
            <p className="rank-info">
              Busyness Rank: {busynessRank}<br/>
              Crime Rank: {crimeRank}<br/>
              Property Rank: {propertyRank}<br/>
              Transit Rank: {transitRank}<br/>
              Cafe Density Rank: {cafeRank}<br/>
              Combined Rank: {combinedRank}
            </p>
            <div className="cafe-info">
              <p><b>  Top Rated Cafes </b></p>
              {selectedCafes.length > 0 ? selectedCafes.slice(0, 3).map((cafe, index) => {
                return (
                  <div key={index}>
                    <p>{cafe.name}: Rating: {cafe.rating}</p>
                    {/* <img  src = {cafe.image_url} className = "cafe_image"></img> */}
                  </div>
                  )
                }) : <p>No cafes in this area</p>}
                <p>Average Cafe Rating: {averageCafe}</p>
              
              
                          </div>
            <LineChart dayData={dayData} weekData={weekData} yearData={yearData} objectID={objectID} sidebarIsOpen={rightSidebar}/>
          </div>
        </div>
        ) : cafeClick ? (
        <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
        <div className="sidebar-content rounded-rect flex-center">
          <h1 className="sidebar-header">{cafe_name} {cafe_rating}</h1>
          <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
            &rarr;
          </div>
          <h2>Reviews: </h2>
          {reviews && Array.isArray(reviews.reviews) && (
          <ul className = "cafe-info">
            {reviews.reviews.map((review, index) => (
              <li key={index}>
                <p>{review.text}</p>
              </li>
            ))}
          </ul>
        )}
        <img src = {cafe_url} style={{width: 360, height: 360}} />
          
          
          </div>
          </div>

        ) : suggestionFlag ? (
          //suggestion info
          <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-content rounded-rect flex-center">
          <h1 className="sidebar-header">Cafe Suggestions</h1>
          <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
            &rarr;
          </div>
         
          </div>
          </div>
        ) : null
        
      ) : null
    )
    }      

export default Drawer;
