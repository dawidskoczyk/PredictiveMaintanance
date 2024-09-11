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
<div style={{ margin: '20px' }}>
      {/* Image Heading */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: '20px', textAlign: 'center' }}>
        <img 
          src={green} 
          alt="Engine State" 
          style={{ height: '50px', width: 'auto', marginRight: '20px' }}
        />
        <h1 style={{ color: "green" }}>
          Actual state of the engine
        </h1>
      </div>

      {/* Flex Container for Date Picker and Heading */}
      <div style={{ display: "flex"}}>
        {/* Date Picker Section */}
          <button
            onClick={() => {
              setClicked((prevState) => !prevState);
            }}
            className="button-64"
            style={{ marginRight: '20px', marginBottom: '10px' }}
          >
            <span>{!clicked ? "Show Date Picker" : "Set Date Range"}</span>
          </button>

          {clicked && (
            <div className="datepicker-overlay" style={{ marginRight: '20px' }}>
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
        <span style={{
  fontSize: '30px',          // Font size
  color: 'blue',             // Text color
  fontWeight: 'bold',        // Font weight
  marginTop: '10px',         // Space above the element
  display: 'block',          // Ensures it takes full width (optional)
  textAlign: 'center',       // Center the text (optional)
}}>
  Testing data from sensors
</span>
      </div>
    </div>
  );
};

Filter.propTypes = {
  onChange: PropTypes.func,
};

export default Filter;
