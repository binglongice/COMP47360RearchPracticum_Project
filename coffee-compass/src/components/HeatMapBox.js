import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const HeatMapBox = ({handleHeatMap}) => {
    const [header, setHeader] = useState('Busyness');
    //state variable to keep track of which checkboxes are checked
    //this is used to determine which layers to display on the map
    const [checked, setChecked] = useState({
        busyness: false,
        crimeData: false,
        prices: false,
        transportData: false,
    });

    //function to handle when a checkbox is checked or unchecked
    //updates the state variable
    //event.target.name is the name of the checkbox that was checked
    //event.target.checked is whether the checkbox was checked or unchecked
    const handleCheckChange = (event) => {
        // Calculate new state
        const newCheckedState = { ...checked, [event.target.name]: event.target.checked };

        // Set state with new state
        setChecked(newCheckedState);

        // Pass new state to parent component
        handleHeatMap(newCheckedState);
        };

    return (
        <div className="HeatMapBox">
            <h3>Heat Map Selection</h3>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked.busyness}
                            onChange={handleCheckChange}
                            name="busyness"
                            style={{ color: '#00FF00', padding: '3px' }}
                            size="small"
                        />
                    }
                    label={<span style={{ fontSize: '12px' }}>Busyness</span>}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked.crimeData}
                            onChange={handleCheckChange}
                            name="crimeData"
                            style={{ color: '#00FF00', padding: '3px' }}
                            size="small"
                        />
                    }
                    label={<span style={{ fontSize: '12px' }}>Crime-Rate</span>}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked.prices}
                            onChange={handleCheckChange}
                            name="prices"
                            style={{ color: '#00FF00', padding: '3px' }}
                            size="small"
                        />
                    }
                    label={<span style={{ fontSize: '12px' }}>Property Prices</span>}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked.transportData}
                            onChange={handleCheckChange}
                            name="transportData"
                            style={{ color: '#00FF00', padding: '3px' }}
                            size="small"
                        />
                    }
                    label={<span style={{ fontSize: '12px' }}>Transport Links</span>}
                />

            </FormGroup>
            <div className='session'>
                <h3>{header}</h3>
                <div className='row colors'>
                </div>
            <div className='row labels'>
                <div className='label-first'>0</div>
                <div className='label-middle'>0.5</div>
                <div className='label-last'>1</div>
            </div>
        </div>
    </div>
    );
};
export default  HeatMapBox;

