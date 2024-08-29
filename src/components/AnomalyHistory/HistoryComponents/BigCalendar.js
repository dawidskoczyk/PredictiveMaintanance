import { Calendar, momentLocalizer,  } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css'; 
const localizer = momentLocalizer(moment)


const myEventsList = [
    {
      title: '6 warnings',
      start: new Date(2024, 7, 29, 10, 0), // August 29, 2024, 10:00 AM
      end: new Date(2024, 7, 29, 12, 0),   // August 29, 2024, 12:00 PM
      hexColor: '#ff7f50',
      data:{ x:6, type:'warning'}
    },
    {
      title: '1 critical',
      start: new Date(2024, 7, 29, 13, 0), // August 29, 2024, 1:00 PM
      end: new Date(2024, 7, 29, 14, 0),   // August 29, 2024, 2:00 PM
      hexColor: '#32cd32',
      data:{ x:1,type:'critical'}
    },
  ];

  const components = {
    event:(props)=>{
        const {data} = props.event
        if(data.type ==='warning'){
            return <div style={{background:'yellow'}}>{props.title}</div>
        }else{
            return <div style={{background:'red'}}>{props.title}</div>
        }
    }
  }

export const MyCalendar = (props) => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      components={{
        //dateCellWrapper: ColoredDateCellWrapper,
        event: components.event,
    }}
    />
  </div>
)