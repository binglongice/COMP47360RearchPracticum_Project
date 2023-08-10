import React from 'react';

const HelpBox = ({setHelpBox}) => {
    const handleHelpBox = () => {
        setHelpBox(helpBox => !helpBox); // toggle between true and false
    }



    return (
        <div> 
            <div className ="backdrop"> </div>
            <div className = "HelpBoxContainer">
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Habitasse platea dictumst vestibulum rhoncus est. Quam pellentesque nec nam aliquam sem et. Ornare arcu odio ut sem. Sagittis vitae et leo duis. Scelerisque felis imperdiet proin fermentum.
                Sit amet dictum sit amet justo donec. Sollicitudin tempor id eu nisl nunc. Ultrices vitae auctor eu augue ut lectus. Tortor pretium viverra suspendisse potenti nullam ac. Nulla facilisi etiam dignissim diam quis. 
                Velit laoreet id donec ultrices tincidunt arcu non. Quis varius quam quisque id diam vel quam elementum pulvinar. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. 
                Sed elementum tempus egestas sed sed risus pretium quam vulputate. Sed odio morbi quis commodo. Nulla malesuada pellentesque elit eget gravida cum sociis.
                </p>

            </div>
            <button className="ExitButton" onClick={handleHelpBox}>Exit</button>
        </div>
    )
}
export default HelpBox;