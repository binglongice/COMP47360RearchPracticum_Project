import React from 'react';

//Test passing in props

const Navbar = ({name, busyness}) => {

    if (busyness) {
    return (
        <div className="nav-bar"> 
        <h1> {name} {busyness} </h1>
        </div>
    );
    } else {
        return (
            <div className="nav-bar">
            <h1> {name} </h1>
            </div>
        )};
};
export default Navbar;