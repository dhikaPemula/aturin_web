import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './features/home_page/ui/screen/home_page.jsx';
import TaskPage from './features/task_page/ui/screen/task_page.jsx';
import ActivityPage from './features/activity/ui/activity_page.jsx';
import Header from './core/widgets/header/header.jsx';
import React, { useState, useEffect } from 'react';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();

  // Map routes to indices
  const routeToIndex = {
    '/home': 0,
    '/task': 1,
    '/activity': 2
  };

  // Update currentIndex when route changes
  useEffect(() => {
    const newIndex = routeToIndex[location.pathname] ?? 0;
    setCurrentIndex(newIndex);
  }, [location.pathname]);

  return (
    <>
      <Header currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      <div className="h-[16vh]" />
      <div className="overflow-hidden w-full" style={{ margin: 0, padding: 0 }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 33.333}%)`,
            width: '300%',
            margin: 0,
            padding: 0
          }}
        >
          <div style={{ width: '33.333%' }}>
            <HomePage />
          </div>
          <div style={{ width: '33.333%' }}>
            <TaskPage />
          </div>
          <div style={{ width: '33.333%' }}>
            <ActivityPage />
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
