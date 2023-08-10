import React, { useState, useEffect, useRef, useContext } from 'react';
import LineChart from './LineChart';
import { ApiContext } from '../context/ApiContext';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoePrints, faHandcuffs, faDollarSign, faBus, faCoffee, faArrowDown, faStarHalf } from '@fortawesome/free-solid-svg-icons';


function Drawer ({getMap, rightSidebar, setRightSidebar, dayData, weekData, yearData, objectID, name, busynessRank, crimeRank, propertyRank, transitRank, combinedRank, cafeRank, cafeId, cafe_url, cafe_name, cafe_rating, cafeClick, setCafeClick, zoneInfo, zoneFlag, setZoneFlag, suggestionFlag, setSelectedImage, setSelectedName, setSelectedRating, setCurrentObjectId, setSideBarName, setZoneBusynessRank, setZoneCrimeRank, setZonePropertyRank, setZoneCombinedRank, setZoneTransportRank, setCafeDensity, setChartFlag, newGeoJson}) {
    

  const [visibleIndex, setVisibleIndex] = useState(0);
  const cycleRankInfo = () => {
    setVisibleIndex((prevIndex) => (prevIndex + 1) % 6); // Assuming there are 6 p elements to cycle through
  };





  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = (rating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
  
    const starIcons = [];
  
    for (let i = 0; i < fullStars; i++) {
      starIcons.push(<FontAwesomeIcon icon={faStar} key={i} />);
    }
  
    if (halfStar) {
      starIcons.push(<FontAwesomeIcon icon={faStarHalf} key={starIcons.length} />);
    }
  
    for (let i = 0; i < emptyStars; i++) {
      starIcons.push(<FontAwesomeIcon icon={faStar} key={starIcons.length} style={{ opacity: 0.3 }} />);
    }
  
    return starIcons;
  }




  function calculateStarIcons(rank) {
    const starCount = calculateStarCount(rank);
    const starIcons = [];

    for (let i = 0; i < starCount; i++) {
      starIcons.push(<FontAwesomeIcon icon={faStar} key={i} />);
    }

    return starIcons;
  }

  function calculateShoePrints(rank) {
    const shoeCount = calculateStarCount(rank);

    const shoePrints = [];

    for (let i = 0; i < shoeCount; i++) {
      shoePrints.push(<FontAwesomeIcon icon={faShoePrints} key={i} />);
    }

    return shoePrints;
  }

  function calculateHandcuffs(rank) {
    const handcuffCount = calculateStarCount(rank);
    const handcuffs = [];

    for (let i = 0; i < handcuffCount; i++) {
      handcuffs.push(<FontAwesomeIcon icon={faHandcuffs} key={i} />);
    }

    return handcuffs;
  }

  function calculateHome(rank) {
    const homeCount = calculateStarCount(rank);
    const homes = [];

    for (let i = 0; i < homeCount; i++) {
      homes.push(<FontAwesomeIcon icon={faDollarSign} key={i} />);
    }

    return homes;
  }

  function calculateShuttleVan(rank) {
    const vanCount = calculateStarCount(rank);

    const shuttleVans = [];

    for (let i = 0; i < vanCount; i++) {
      shuttleVans.push(<FontAwesomeIcon icon={faBus} key={i} />);
    }

    return shuttleVans;
  }

  function calculateCoffee(rank) {
    const coffeeCount = calculateStarCount(rank);

    const coffees = [];

    for (let i = 0; i < coffeeCount; i++) {
      coffees.push(<FontAwesomeIcon icon={faCoffee} key={i} />);
    }

    return coffees;
  }

  function calculateStarCount(rank) {
    if (rank >= 1 && rank <= 14) {
      return 5;
    } else if (rank >= 15 && rank <= 28) {
      return 4;
    } else if (rank >= 29 && rank <= 42) {
      return 3;
    } else if (rank >= 43 && rank <= 56) {
      return 2;
    } else if (rank >= 57 && rank <= 66) {
      return 1;
    }
    return 0; // Return 0 for ranks outside the defined ranges
  }
  
  
    const sidebarRef = useRef(null);
    const {sortedCafes, reviews, fetchReviews} = useContext(ApiContext);  
    const [selectedCafes, setSelectedCafes] = useState([]);
    const [averageCafe, setAverageCafe] = useState([]);
    // const [newCafeID, setNewCafeID] = useState(null);
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

      console.log("zone info: ", zoneInfo[0], zoneInfo[1])

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
            const padding = { bottom: 300 };
            map.easeTo({
                padding: padding,
                duration: 1000
            });
        } else {
            const padding = { bottom: 0 };
            map.easeTo({
                padding: padding,
                duration: 1000
            });
        }
    }, [rightSidebar, getMap]);
    
    const toggleSidebar = (side) => {
        const map = getMap();
        if (side === 'right') {
            setRightSidebar(false);
            setRightSidebar(false);
            setCafeClick(false);
            const padding = { bottom: 0 };
            map.easeTo({
                padding: padding,
                duration: 1000
            });
        }
    };

    useEffect(() => {
      console.log("right sidebar", rightSidebar)
      }, [rightSidebar])

      const [cafeCount, setCafeCount] = useState(0);
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
  
        // round to the nearest half decimal
        average = Math.round(average * 2) / 2;
  
        setAverageCafe(average);
        setCafeCount(count);
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

      //returns the cafe information page if a cafe is clicked in the drawer
      const selectCafe = (cafe) => {
        setRightSidebar(true);
        setCafeClick(true);
        setZoneFlag(false); // This assumes that you want to close the zone drawer if it is open
        // set the selected cafe state
        fetchReviews(cafe.id)
        setSelectedImage(cafe.image_url)
        setSelectedName(cafe.name)
        setSelectedRating(cafe.rating)
        // setNewCafeID(cafe.objectid)
      };

      // //changes the drawer so it renders the zoneInfo page instead of the cafe info Page
      // const handleZoneButtonClick = (target) => {
        
      //   let target2 = target;
      //   console.log("target 2", target2);
      //   let feature = newGeoJson.features.find(feature => feature.properties.objectid === target2);
      //   if (feature) {
      //     setChartFlag(true);
      //     setCurrentObjectId(feature.properties.objectid);
      //     setCafeClick(false);
      //     setSideBarName(feature.properties.zone);
      //     setZoneBusynessRank(feature.properties.busyness_rank);
      //     setZoneCrimeRank(feature.properties.crime_rank);
      //     setZonePropertyRank(feature.properties.prices_rank);
      //     setZoneCombinedRank(feature.properties.combined_rank);
      //     setZoneTransportRank(feature.properties.transport_rank);
      //     setCafeDensity(feature.properties.cafe_rank);
      //     setZoneFlag(true);
      //     setRightSidebar(true);
      //   } else {
      //     console.log("No feature found with objectid: " + target2);
      //   }      };

      //changes the drawer so it renders the zoneInfo page instead of the suggested Zones Page
      const handleZoneNameClick = (zone) => {
        const properties = zone.properties;
        setChartFlag(true);
        setCurrentObjectId(properties.objectid);
        setCafeClick(false);
        setSideBarName(properties.zone);
        setZoneBusynessRank(properties.busyness_rank);
        setZoneCrimeRank(properties.crime_rank);
        setZonePropertyRank(properties.prices_rank);
        setZoneCombinedRank(properties.combined_rank);
        setZoneTransportRank(properties.transport_rank);
        setCafeDensity(properties.cafe_rank);
        setZoneFlag(true);
        setRightSidebar(true);
      };
    


//using a ternerary operator to switch between three conditions
    return (
      rightSidebar ? (
        zoneFlag  ? (
        <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-content rounded-rect flex-center">
            <h1 className="sidebar-header">{name}</h1>
            <div className='sidebar-zone-rating'>
              {/* Use the visibleIndex state to show/hide the p elements */}
              <p className="rank-info" onClick={cycleRankInfo}>
          {visibleIndex === 0 && (
            <span>
              Busyness: {calculateShoePrints(busynessRank)}
            </span>
          )}
          {visibleIndex === 1 && (
            <span>
              Crime: {calculateHandcuffs(crimeRank)}
            </span>
          )}
          {visibleIndex === 2 && (
            <span>
              Property: {calculateHome(propertyRank)}
            </span>
          )}
          {visibleIndex === 3 && (
            <span>
              Transit: {calculateShuttleVan(transitRank)}
            </span>
          )}
          {visibleIndex === 4 && (
            <span>
              Cafe Density: {calculateCoffee(cafeRank)}
            </span>
          )}
          {visibleIndex === 5 && (
            <span>
              Selection: #{combinedRank}
              
              {/* {calculateStarIcons(combinedRank)} */}
            </span>
          )}
        </p>
            </div>
            
            <div class="sidebar-toggle rounded-rect right">
            
            </div>
            <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
              <FontAwesomeIcon icon={faArrowDown} />
            </div>
            
            <div className="zone-cafe-info">
              <p id="zone-cafe-title"><b> Cafés: {cafeCount} </b></p>
              {selectedCafes.length > 0 ? selectedCafes.slice(0, 3).map((cafe, index) => {
                return (
                  <div className='zone-cafe' key={index} onClick={() => selectCafe(cafe)}> 
                    <p>
                      <b className = "cafe-name">{cafe.name} </b>
                      <br />                      
                      <div className="zone-cafe-rating">
                        {generateStars(cafe.rating)}
                        <div className='zone-background-stars zone-cafe-rating'>
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        </div>
                      </div>
                      </p>
                    <img  src = {cafe.image_url} className = "zone-cafe_image"></img>
                  </div>
                  )
                }) : <p>No cafes in this area</p>}
                <p id="av-cafe-rating">Avg: 
                <div className="zone-av-cafe-rating">
                        {generateStars(Math.round(averageCafe * 2) / 2)}
                        <div className='zone-av-background-stars zone-av-cafe-rating'>
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
                        </div>
                      </div>
                </p>
              
              
                          </div>
             {zoneFlag && <LineChart dayData={dayData} weekData={weekData} yearData={yearData} objectID={objectID} sidebarIsOpen={rightSidebar}/>}
          </div>
        </div>
        ) 
        
        : cafeClick ? (


<div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
        <div className="sidebar-content rounded-rect flex-center">
          <h1 className="sidebar-cafe-header">{cafe_name}</h1>
          <div className="sidebar-cafe-rating">
            {generateStars(cafe_rating)}
            <div className='background-stars'>
            <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
            <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
            <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
            <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
            <FontAwesomeIcon icon={faStar} style={{ opacity: 0.3 }} />
            </div>
          </div>
          <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
          <FontAwesomeIcon icon={faArrowDown} />
          </div>
          {reviews && Array.isArray(reviews.reviews) && (
          <ul className = "cafe-info-ul">
            {reviews.reviews.map((review, index) => (
              <li key={index}>
                <p>"{review.text}"</p>
              </li>
            ))}
          </ul>
        )}
        <img className="cafe-img" src = {cafe_url} />
          
          
          </div>
          </div>

        ) : suggestionFlag ? (
          //suggestion info
          <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-content rounded-rect flex-center">
          <h1 className="suggestion-sidebar-header">Top Zone Rankings</h1>
          <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
          <FontAwesomeIcon icon={faArrowDown} />
          </div>
          <div className="zone-info">
      {zoneInfo.map((zone, index) => (
        <div key={index} className="zone-item">
          <h2 className="cafe-name" onClick={() => handleZoneNameClick(zone)}>
            #{index + 1} {zone.properties.zone}
          </h2>
          <div className="rating-container">
            <div className='rating-text-div'>
            <p>
              <span className="rating-text">Busyness: </span>
            </p>
            <p>
              <span className="rating-text">Crime: </span>
            </p>
            <p>
              <span className="rating-text">Property: </span>
            </p>
            <p>
              <span className="rating-text">Transit:</span> 
            </p>
            <p>
              <span className="rating-text">Cafe Density:</span> 
            </p>
            </div>
            <div className='rating-stars-div'>
            <p>
              <span className='rating-stars'>{calculateShoePrints(zone.properties.busyness_rank)}</span>
            </p>
            <p>
              <span className='rating-stars'>{calculateHandcuffs(zone.properties.crime_rank)}</span>
            </p>
            <p>
              <span className='rating-stars'>{calculateHome(zone.properties.prices_rank)}</span>
            </p>
            <p>
              <span className='rating-stars'>{calculateShuttleVan(zone.properties.transport_rank)}</span>
            </p>
            <p>
              <span className='rating-stars'>{calculateCoffee(zone.properties.cafe_rank)}</span>
            </p>
            </div>
          </div>
        </div>
      ))}
    </div>
          </div>
          </div>
        ) : null
        
      ) : null
    )
    }      

export default Drawer;
