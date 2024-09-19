import "../App.css";
import React, { useState } from "react";
import PropTypes from "prop-types";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, subDays } from "date-fns";
import green from "./icons/green.png"
import orange from "./icons/orangeEng.png"
import red from "./icons/redEng.png"

let firstCLick = true;

const Filter = ({ onChange, startDate, endDate }) => {
  const [date, setDate] = useState([
    {
      startDate: subDays(new Date(), 0),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDate([selection]);

    if (selection != null && !firstCLick)
      console.log(`start ${selection.startDate} end ${selection.endDate}`);
    onChange(selection);
    if (firstCLick) firstCLick = !firstCLick;
  };

  const [clicked, setClicked] = useState(false);
  const [imageSrc, setImageSrc] = useState('./icons/green.png'); // Default image

  // Function to change image dynamically
  const changeImage = (newImage) => {
    setImageSrc(`/icons/${newImage}`);
  };

  return (
<div style={{display: "flex"}}>
      {/* Image Heading */}
      {/* <div style={{ display: "flex", alignItems: "center", margin: '40px 50px', textAlign: 'center' }}>
      <h1 style={{ color: "green" }}>
          State of the engine:
        </h1>
        <img 
          src={green} 
          alt="Engine State" 
          style={{ height: '50px', width: 'auto', marginRight: '20px', marginLeft: "20px" }}
        />
        
      </div> */}

      {/* Flex Container for Date Picker and Heading    border: "dashed",*/}
      <div style={{ display: "flex", width: "90%", margin: "0 auto", marginTop: "10px", flexDirection: "column"}}>
        {/* Date Picker Section */}
        <span style={{
  fontSize: '20px',          // Font size
  color: 'black',             // Text color
  fontWeight: 'bold',        // Font weight
  marginTop: '0px',         // Space above the element
           // Ensures it takes full width (optional)
  textAlign: 'center',       // Center the text (optional)
  
}}>
  Select range of data from sensors
</span>
          <button
            onClick={() => {
              setClicked((prevState) => !prevState);
            }}
            className="button-64"
            style={{ marginRight: '0px', marginBottom: '10px', marginTop: "10px", width: "50px", maring: "0 auto"}}
          >
            <span>{!clicked ? "Date Picker" : "Set Date Range"}</span>
          </button>

          {clicked && (
            <div className="datepicker-overlay" style={{ marginLeft: '400px', marginTop: "46.5%" }}>
              <DateRangePicker
                onChange={handleOnChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                retainEndDateOnFirstSelection={false}
                months={1}
                ranges={date}
                direction="horizontal"
              />
            </div>
          )}

        {/* Blue Headings Section */}
        
      </div>
    </div>
  );
};

Filter.propTypes = {
  onChange: PropTypes.func,
};

export default Filter;
