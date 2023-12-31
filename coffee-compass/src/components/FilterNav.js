import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBus, faSubway, faChair, faCoffee, faBicycle } from '@fortawesome/free-solid-svg-icons';




//every button has an index number associated with it
// handle click button checks to see if 4 is in array, if not it will add it, if it is already there it will remove it
// results in toggling buttons through the use of an array

function FilterNav({activeButtons, setActiveButtons, handleLayerChange }) {
    // const [activeButtons, setActiveButtons] = useState([]);
  
    const handleClick = (index) => {
        if (activeButtons.includes(index)) {
          // Index already exists in the array, so remove it
          const updatedButtons = activeButtons.filter((buttonIndex) => buttonIndex !== index);
          setActiveButtons(updatedButtons);
          handleLayerChange(updatedButtons);
        } else {
          // Index doesn't exist in the array, so add it
          const updatedButtons = [...activeButtons, index];
          setActiveButtons(updatedButtons);
          handleLayerChange(updatedButtons);
        }
        // console.log(activeButtons);
      };
        return (
    // <nav className="filter-nav" role="filter">
     <nav className="filter-nav" >
    <ul>
        {/* <li>
          <a
            href="#"
            onClick={() => handleClick(0)}
            className={activeButtons.includes(0) ? 'active' : ''} //causes hover to stick (for buttons) - via CSS
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faTaxi} />
          </a>
        </li> */}
        <li>
          <div
            // href="#"
            onClick={() => handleClick(3)}
            className={activeButtons.includes(3) ? 'active' : ''}
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faBus} />
          </div>
        </li>
        <li>
          <div
            // href="#"
            onClick={() => handleClick(2)}
            className={activeButtons.includes(2) ? 'active' : ''}
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faSubway} />
          </div>
        </li>
        <li>
          <div
            // href="#"
            onClick={() => handleClick(1)}
            className={activeButtons.includes(1) ? 'active' : ''}
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faChair} />
          </div>
        </li>
        <li>
          <div
            // href="#"
            onClick={() => handleClick(4)}
            className={activeButtons.includes(4) ? 'active' : ''}
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faCoffee} />
          </div>
        </li>
        <li>
          <div
            // href="#"
            onClick={() => handleClick(5)}
            className={activeButtons.includes(5) ? 'active' : ''}
          >
            <span className="inner"></span>
            <FontAwesomeIcon icon={faBicycle} />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default FilterNav;
