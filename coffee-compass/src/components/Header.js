import React from 'react';
import Menu from './menu';// Adjust the path based on the actual location of the file

const Header = () => {
  return (
    <div className="wrap">
      <div className="bar">
        <div className="header">
          <div className="header_top">
            <Menu />
            {/* Rest of the header content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
