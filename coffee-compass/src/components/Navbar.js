import React from 'react';

//Test passing in props

const Navbar = (props) => {
    const {name} = props;
    return (
        <div className="nav-bar"> 
        <h1> {name} </h1>
        </div>
    )
};
export default Navbar;