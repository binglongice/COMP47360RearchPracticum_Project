import React, { useState, useEffect } from 'react';

const HelpButton = ({helpBox, setHelpBox}) => {
    

    const handleHelpBox = () => {
        setHelpBox(helpBox => !helpBox); // toggle between true and false
    }

    return (
        <button className = "helpButton" onClick={handleHelpBox}>?</button>
    )

} 

export default HelpButton;