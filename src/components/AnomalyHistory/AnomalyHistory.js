import React from 'react';
import { Link } from 'react-router-dom';
import { MyCalendar} from './HistoryComponents/BigCalendar';
export function History() {
  return (
    <div>
      <h1> History Page</h1>
      {/* <Link to="/home">
      <button>Home</button>
    </Link> */}
    <MyCalendar></MyCalendar>
    </div>
  );
}

