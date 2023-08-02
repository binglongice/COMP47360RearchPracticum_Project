import React from 'react';

const SideContent = () => {
  return (
    <div className="side_content">
      <div className="grid_img">
        <img src="map.png" alt="" />
      </div>
      <div className="price_desc">
        <a href="#">
          <div className="price">Free</div>
          <div className="price_text">
            <h4>
              <span>Today Special</span>*Join the membership
            </h4>
          </div>
          <div className="clear"></div>
        </a>
      </div>
    </div>
  );
};

export default SideContent;
