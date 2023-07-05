import React, { useState } from 'react';

function FilterNav({ handleLayerChange }) {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (index) => {
    handleLayerChange(index);
    setActiveButton(index);
  };

  return (
    <nav className="filter-nav" role="filter">
      <ul>
        <li>
          <a
            href="#"
            onClick={() => handleClick(0)}
            className={activeButton === 0 ? 'active' : ''}
          >
            <span className="inner"></span>
            <img src="./taxi.png" alt="Taxi" />
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => handleClick(3)}
            className={activeButton === 3 ? 'active' : ''}
          >
            <span className="inner"></span>
            <img src="./bus_stop.png" alt="Bus Stop" />
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => handleClick(2)}
            className={activeButton === 2 ? 'active' : ''}
          >
            <span className="inner"></span>
            <img src="./metro.png" alt="Metro" />
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => handleClick(1)}
            className={activeButton === 1 ? 'active' : ''}
          >
            <span className="inner"></span>
            <img src="./bench.png" alt="Bench" />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default FilterNav;
