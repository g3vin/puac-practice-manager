import HomeNavbar from './HomeNavbar';
import './Calendar.css';

const Calendar = () => {
  return (
    <>
      <HomeNavbar />
      <div className="calendar-page">
        <h1>Calendar</h1>
        <div className="calendar-container">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=purduearchery22@gmail.com&ctz=America/New_York&showTitle=0"
            style={{ border: 0, borderRadius: '15px' }}
            width='100%'
            height='100%'
            allowFullScreen
            title='PUAC Calendar'
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Calendar;