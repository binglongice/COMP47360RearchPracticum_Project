import React, { useState } from 'react';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top" id="Index">
      <div className="menu">
        <h1 className="logo">
          <a href="#"></a>
        </h1>
        <ul className="nav">
          <li>
            <a href="#Index">Index</a>
          </li>
          <li>
            <a href="#Service">Service</a>
          </li>
          <li>
            <a href="#Organization">Organization</a>
          </li>
          <li>
            <a href="#Legal">Legal</a>
          </li>
          <li>
            <a href="#Property">Property</a>
          </li>
          <li>
            <a href="#Feedback">Feedback</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
