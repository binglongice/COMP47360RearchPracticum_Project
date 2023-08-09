import React from 'react';

const HelpButton = ({setRun}) => {
    

    const handleHelpBox = () => {
        console.log("setting run to true")
        setRun(false)
        setRun(true) // toggle between true and false
    }

    return (
        <button className = "helpButton" onClick={handleHelpBox}>?</button>
    )

} 

export default HelpButton;