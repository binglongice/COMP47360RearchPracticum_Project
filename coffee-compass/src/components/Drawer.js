import React, { useState, useEffect, useRef } from 'react';
import LineChart from './LineChart';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoePrints, faHandcuffs, faDollarSign, faBus, faCoffee } from '@fortawesome/free-solid-svg-icons';


function Drawer ({getMap, rightSidebar, setRightSidebar, dayData, weekData, yearData, objectID, name, busynessRank, crimeRank, propertyRank, transitRank, combinedRank}) {
    const sidebarRef = useRef(null);


    useEffect(() => {
        const map = getMap();
        // Now you have the latest value of the map
        console.log("Map test", map);
    
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
        if (side === 'right') {
            setRightSidebar(!rightSidebar);
        }
    };

    return (
        <div ref={sidebarRef} id="right" className={`sidebar flex-center right ${rightSidebar ? '' : 'collapsed'}`}>
          <div className="sidebar-content rounded-rect flex-center">
            <h1 className="sidebar-header">{name}</h1>
            <div className='sidebar-zone-rating'>
            {/* <div id="overall-rating">
                <p>
                Rating:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div> */}
              <div id="busyness-rating">
                <p>
                Busy:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faShoePrints} />
                  <FontAwesomeIcon icon={faShoePrints} />
                  <FontAwesomeIcon icon={faShoePrints} />
                  <FontAwesomeIcon icon={faShoePrints} />
                  <FontAwesomeIcon icon={faShoePrints} />
                </div>
              </div>
              {/*}
              <div id="crime-rating">
                <p>
                Crime:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faHandcuffs} />
                  <FontAwesomeIcon icon={faHandcuffs} />
                  <FontAwesomeIcon icon={faHandcuffs} />
                  <FontAwesomeIcon icon={faHandcuffs} />
                  <FontAwesomeIcon icon={faHandcuffs} />
                </div>
              </div>
              <div id="price-rating">
                <p>
                Price:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faDollarSign} />
                  <FontAwesomeIcon icon={faDollarSign} />
                  <FontAwesomeIcon icon={faDollarSign} />
                  <FontAwesomeIcon icon={faDollarSign} />
                  <FontAwesomeIcon icon={faDollarSign} />
                </div>
              </div>
              <div id="transit-rating">
                <p>
                Transit:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faBus} />
                  <FontAwesomeIcon icon={faBus} />
                  <FontAwesomeIcon icon={faBus} />
                  <FontAwesomeIcon icon={faBus} />
                  <FontAwesomeIcon icon={faBus} />
                </div>
              </div>
              <div id="cafe-density-rating">
                <p>
                Density:
                </p>
                <div id="score">
                  <FontAwesomeIcon icon={faCoffee} />
                  <FontAwesomeIcon icon={faCoffee} />
                  <FontAwesomeIcon icon={faCoffee} />
                  <FontAwesomeIcon icon={faCoffee} />
                  <FontAwesomeIcon icon={faCoffee} />
                </div>
              </div> */}



            </div>
            <div className='sidebar-help-button'>?</div>
            <div class="sidebar-toggle rounded-rect right">→
            
            
            </div>
            <div className="sidebar-toggle rounded-rect right" onClick={() => toggleSidebar('right')}>
              <p>^</p>
            </div>
            <p className="rank-info">
              Busyness Rank: {busynessRank}<br/>
              Crime Rank: {crimeRank}<br/>
              Property Rank: {propertyRank}<br/>
              Transit Rank: {transitRank}<br/>
              Combined Rank: {combinedRank}
            </p>
            <LineChart dayData={dayData} weekData={weekData} yearData={yearData} objectID={objectID} sidebarIsOpen={rightSidebar}/>
          </div>
        </div>
      )
    }      

export default Drawer;
