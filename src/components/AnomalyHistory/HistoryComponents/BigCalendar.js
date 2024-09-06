import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css'; 
import { useState, useEffect } from 'react';

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    title: '6 warnings',
    start: new Date(2024, 7, 29, 10, 0), // August 29, 2024, 10:00 AM
    end: new Date(2024, 7, 29, 12, 0),   // August 29, 2024, 12:00 PM
    data: { x: 6, type: 'warning' }
  },
  {
    title: '1 critical',
    start: new Date(2024, 7, 29, 13, 0), // August 29, 2024, 1:00 PM
    end: new Date(2024, 7, 29, 14, 0),   // August 29, 2024, 2:00 PM
    data: { x: 1, type: 'critical' }
  },
];

function MyCalendar() {
  const [view, setView] = useState('month');
  const [dataWeek, setDataWeek] = useState([]);
  const [myEventsListWeek, setMyEventsListWeek] = useState(myEventsList);  // Initialize with myEventsList

  const components = {
    event: (props) => {
      const { data } = props.event;
      if (data.x > 32) {
        return <div style={{ background: 'red', color:'white' }}>{data?.x}</div>;
      } else if (data.x > 30){
        return <div style={{ background: 'yellow', color:'white' }}>{data?.x}</div>;
      }else{
        return <div style={{ background: 'green', color:'white' }}>{data?.x}</div>;
      }
    },
  };

  // Event handler for view changes (e.g., from month to week)
  const handleViewChange = (newView) => {
    setView(newView);
     // Update events based on the new view
  };
  
  const handleNavigate = (date, view) => {
    setView(view);
  
    // Calculate start and end dates based on the view
    let startDate, endDate;
    
    if (view === 'month') {
      // For month view, calculate the start and end of the current month
      startDate = moment(date).startOf('month').toDate();
      endDate = moment(date).endOf('month').toDate();
    } else if (view === 'week') {
      // For week view, calculate the start and end of the current week
      startDate = moment(date).startOf('week').toDate();
      endDate = moment(date).endOf('week').toDate();
    }
  
    updateEventsForView(view, startDate, endDate);
  };
  

  const updateEventsForView = async (newView, startDate, endDate) => {
   
      try {
        // Format dates to YYYY-MM-DD
        const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
        
        const response = await fetch('http://localhost:5001/api/dataCal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ startDate: formattedStartDate, endDate: formattedEndDate })
        });
        const weekEvents = await response.json();
        setDataWeek(weekEvents.message); // Assuming you're storing events in state
  
        // Create an array to accumulate events
        const eventsArray = [];
  
        weekEvents.message.forEach((data) => {
          const startDate = new Date(data.date);
          const endDate = new Date(startDate);
          endDate.setMinutes(startDate.getMinutes() + 15); // Add 15 minutes to the start time
  
          // Push each event into the array
          eventsArray.push({
            title: data._id, // Dynamically create title from data
            start: startDate, // Actual start date
            end: endDate, // End date (15 minutes later)
            data: { x: data.value, type: data.thing } // Data object for the event
          });
        });
  
        // Set the state with the accumulated events array
        setMyEventsListWeek(eventsArray);
        console.log(myEventsListWeek);
      } catch (error) {
        console.error('Error fetching week events:', error);
      
    }
  };
  

  // Optional: Handle date range changes if you need to modify events based on the current range


  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsListWeek} // Updated events list
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        view={view}
        onView={handleViewChange} // Event handler for view changes
        onNavigate={handleNavigate} // Optional: Handle date range changes
        components={{
          event: components.event,
        }}
      />
    </div>
  );
}

export default MyCalendar;
