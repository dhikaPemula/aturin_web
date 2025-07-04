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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const today = React.useMemo(() => new Date(), []);

  // Update waktu setiap detik
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler untuk update currentDate dari Calendar
  const handleCalendarChange = (date) => {
    setCalendarDate(date);
  };

  // Handler untuk search input
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    console.log('Search query changed:', query);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.greetingSection}>
            <Greeting />
          </div>
          <div className={styles.addSection}>
            <AddSection />
          </div>
        </div>
        <Search 
          onSearchChange={handleSearchChange}
          value={searchQuery}
          placeholder="Cari tugas, jadwal, atau aktivitas..."
        />
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
            <List 
              currentIndex={filterIndex} 
              selectedDate={calendarDate}
              searchQuery={searchQuery}
            />
            <div className={styles.calendarDesktop}>
              <Calendar
                today={today}
                currentDate={calendarDate}
                onDateChange={handleCalendarChange}
              />
            </div>
        </div>
        {/* <p>Token: {localStorage.getItem('token')}</p>
        <p>Tanggal kalender: {calendarDate.toLocaleDateString('id-ID')}</p>
        <p>Filter index: {filterIndex}</p>
        <p>TaskCount akan menghitung untuk tanggal: {calendarDate.toLocaleDateString('id-ID')}</p>
        <p>Search query: "{searchQuery}"</p>
        <p>Waktu sekarang: {currentTime.toLocaleString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}</p> */}
      </div>
    </>
  );
}
export default HomePage;
