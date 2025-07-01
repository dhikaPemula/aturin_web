import Header from "../../../../core/widgets/header/header.jsx";
import styles from "./home_page.module.css";
import Greeting from "../widget/greeting/greeting.jsx";
import AddSection from "../widget/addsection/add_section.jsx";
import Search from "../widget/search/search.jsx";
import Filter from "../widget/filter/filter.jsx";
import Calendar from "../widget/calendar/calendar.jsx";
import TaskCount from "../widget/taskcount/taskcount.jsx";
import List from "../widget/list/list.jsx";
import React from "react";

function HomePage() {
  const [filterIndex, setFilterIndex] = React.useState(0);
  const [calendarDate, setCalendarDate] = React.useState(new Date());
  const today = React.useMemo(() => new Date(), []);

  // Handler untuk update currentDate dari Calendar
  const handleCalendarChange = (date) => {
    setCalendarDate(date);
  };

  return (
    <>
      <div className={styles.container}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Greeting />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <AddSection />
          </div>
        </div>
        <Search />
        <Filter currentIndex={filterIndex} setCurrentIndex={setFilterIndex} />
        {(filterIndex === 0 || filterIndex === 1) && <div className={styles.taskCountContainer}><TaskCount selectedDate={calendarDate} /></div>}
        <div className={styles.calendarMobile}>
          <Calendar
            today={today}
            currentDate={calendarDate}
            onDateChange={handleCalendarChange}
          />
        </div>
        <div className={styles.listandCalendar}>
            <List currentIndex={filterIndex} selectedDate={calendarDate} />
            <div className={styles.calendarDesktop}>
              <Calendar
                today={today}
                currentDate={calendarDate}
                onDateChange={handleCalendarChange}
              />
            </div>
        </div>
        <p>Token: {localStorage.getItem('token')}</p>
        <p>Tanggal kalender: {calendarDate.toLocaleDateString('id-ID')}</p>
        <p>Filter index: {filterIndex}</p>
        <p>TaskCount akan menghitung untuk tanggal: {calendarDate.toLocaleDateString('id-ID')}</p>
      </div>
    </>
  );
}
export default HomePage;
