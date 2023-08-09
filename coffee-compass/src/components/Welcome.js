import React from 'react';


//this componenet will have a tutorial button and text explaining the site
//the text will be on top of the map and  the button will be beside the text


const Welcome = ({setShowWelcome, setRun}) => {
    //start function
    const start = () => {
        setShowWelcome(false);
        setRun(true);
    }

    //skip function
    const skip = () => {
        setShowWelcome(false);
    }

    return (
         <> 
         <div className ="backdrop"> </div> 
            <div className = "welcome"> 
                <p className = "Welcome-Text">Welcome to Coffee Compass, the ultimate analytical tool for prospective Cafe Owners. Please use our tutorial to get familiar with the site. Otherwise, feel free to skip and find your ideal location.</p>
                <button className = "Welcome-Button" onClick={start}> Start Tutorial </button>
                <br></br>
                <button className = "Welcome-Button"onClick={skip}> Skip Tutorial </button>

            </div>
        </>
    )


};

export default Welcome;