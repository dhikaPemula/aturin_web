import { Routes, Route } from 'react-router-dom';
import HomePage from './features/home_page/ui/screen/home_page.jsx';
import TaskPage from './features/task_page/ui/screen/task_page.jsx';
import ActivityPage from './features/activity/ui/activity_page.jsx';
import Header from './core/widgets/header/header.jsx';
import React, { useState } from 'react';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <Header />
      <div style={{ height: 100 }} />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
    </>
  );
}
export default App;
