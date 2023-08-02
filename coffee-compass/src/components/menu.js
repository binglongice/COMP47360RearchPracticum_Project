import React, { useState } from 'react';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="menu">
      <nav className={isMenuOpen ? 'menu-open' : 'menu-closed'}>
        <ul className="clearfix">
          <li className="active"><a href="index.html">HOME</a></li>
          <li><a href="about.html">ORGANIZATIONS</a></li>
          <li><a href="services.html">LEGAL</a></li>
          <li><a href="Price.html">PROPERTY</a></li>
          <li><a href="contact.html">EQUIPMENT</a></li>
          <li><a href="about.html">SERVICES</a></li>
          <li><a href="services.html">MARKETING</a></li>
          <li><a href="Price.html">FEEDBACK</a></li>
        </ul>
        <a href="#" id="pull" onClick={handleMenuClick}>
          {isMenuOpen ? 'Close' : 'Menu'}
        </a>
      </nav>
    </div>
  );
};

export default Menu;
