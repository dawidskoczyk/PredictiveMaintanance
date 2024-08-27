import "../App.css";
import React, { useState } from "react";
import PropTypes from "prop-types";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, subDays } from "date-fns";
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
  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginLeft: "2%", paddingTop: "1%" }}>
        <button
          onClick={() => {
            setClicked((prevState) => !prevState);

            // if (clicked) window.location.reload();
          }}
          className="button-64"
        >
          <span>{!clicked ? "Show Date Picker" : "Set Date Range"}</span>
        </button>
      </div>
      {clicked && (
        <div className="datepicker-overlay">
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

      <div>
        <h1 style={{ color: "blue", marginLeft: 50 }}>
          Testing data from sensors
        </h1>
      </div>
    </div>
  );
};

Filter.propTypes = {
  onChange: PropTypes.func,
};

export default Filter;
