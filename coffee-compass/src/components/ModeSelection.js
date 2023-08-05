import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';

const ModeSelection = () => {
    const { mode, setMode } = useContext(ApiContext);

    const handleChange = (e) => {
        // reset all modes to false, then set the selected one to true
        setMode({
            cafe: false,
            bar: false,
            rest: false,
            [e.target.value]: true
        });
    }

    useEffect(() => {
        console.log("TESTING MODE", mode);
    }, [mode])

    return (
        <div className = "mode-selection">
            <form>
                <label>
                    Cafe
                    <input 
                        type="radio"
                        value="cafe"
                        checked={mode.cafe}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bar
                    <input 
                        type="radio"
                        value="bar"
                        checked={mode.bar}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Restaurant
                    <input 
                        type="radio"
                        value="rest"
                        checked={mode.rest}
                        onChange={handleChange}
                    />
                </label>
            </form>
        </div>
    )
}
export default ModeSelection;
