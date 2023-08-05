import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCoffee, faVanShuttle, faHandcuffs, faShoePrints, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const HeatMapBox = ({ handleHeatMap, setFindSuggestionButton }) => {
    const [checked, setChecked] = useState({
        busyness: true,
        crimeData: false,
        prices: false,
        transportData: false,
        cafeDensity: false,
    });

    const handleCheckChange = (event) => {
        const newCheckedState = { ...checked, [event.target.name]: event.target.checked };
        setChecked(newCheckedState);
        handleHeatMap(newCheckedState);
    };

    useEffect(() => {
        handleHeatMap(checked);
    }, []);

    return (
        <div className="HeatMapBox">
            <h3>Heat Map Selection</h3>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<FontAwesomeIcon icon={faShoePrints} style={{ fontSize: '18px', color: '#555555', transform: 'rotate(270deg)' }} />}
                            checkedIcon={<FontAwesomeIcon icon={faShoePrints} style={{ fontSize: '18px', color: 'antiquewhite', transform: 'rotate(270deg)' }} />}
                            checked={checked.busyness}
                            onChange={handleCheckChange}
                            name="busyness"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50px',
                                backgroundColor: checked.busyness ? '#555555' : 'antiquewhite',
                            }}
                            size="small"
                        />
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<FontAwesomeIcon icon={faHandcuffs} style={{ fontSize: '18px', color: '#555555' }} />}
                            checkedIcon={<FontAwesomeIcon icon={faHandcuffs} style={{ fontSize: '18px', color: 'antiquewhite' }} />}
                            checked={checked.crimeData}
                            onChange={handleCheckChange}
                            name="crimeData"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50px',
                                backgroundColor: checked.crimeData ? '#555555' : 'antiquewhite',
                            }}
                            size="small"
                        />
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<FontAwesomeIcon icon={faHome} style={{ fontSize: '18px', color: '#555555' }} />}
                            checkedIcon={<FontAwesomeIcon icon={faHome} style={{ fontSize: '18px', color: 'antiquewhite' }} />}
                            checked={checked.prices}
                            onChange={handleCheckChange}
                            name="prices"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50px',
                                backgroundColor: checked.prices ? '#555555' : 'antiquewhite',
                            }}
                            size="small"
                        />
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<FontAwesomeIcon icon={faVanShuttle} style={{ fontSize: '18px', color: '#555555' }} />}
                            checkedIcon={<FontAwesomeIcon icon={faVanShuttle} style={{ fontSize: '18px', color: 'antiquewhite' }} />}
                            checked={checked.transportData}
                            onChange={handleCheckChange}
                            name="transportData"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50px',
                                backgroundColor: checked.transportData ? '#555555' : 'antiquewhite',
                            }}
                            size="small"
                        />
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<FontAwesomeIcon icon={faCoffee} style={{ fontSize: '18px', color: '#555555' }} />}
                            checkedIcon={<FontAwesomeIcon icon={faCoffee} style={{ fontSize: '18px', color: 'antiquewhite' }} />}
                            checked={checked.cafeDensity}
                            onChange={handleCheckChange}
                            name="cafeDensity"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50px',
                                backgroundColor: checked.cafeDensity ? '#555555' : 'antiquewhite',
                            }}
                            size="small"
                        />
                    }
                />
            </FormGroup>
            <button className="buttonSuggestion" onClick={() => setFindSuggestionButton(true)}>
                <span className="buttonText">Top Zone</span>
                <FontAwesomeIcon icon={faLocationDot} />
            </button>

        </div>
    );
};

export default HeatMapBox;
