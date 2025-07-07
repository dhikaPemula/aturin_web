import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const DataRefreshContext = createContext();

// Hook to use the context
export const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (!context) {
    throw new Error('useDataRefresh must be used within a DataRefreshProvider');
  }
  return context;
};

// Provider component
export const DataRefreshProvider = ({ children }) => {
  const [taskRefreshTrigger, setTaskRefreshTrigger] = useState(0);
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0);
  const [alarmRefreshTrigger, setAlarmRefreshTrigger] = useState(0);

  // Function to trigger task data refresh across all components
  const triggerTaskRefresh = useCallback(() => {
    setTaskRefreshTrigger(prev => prev + 1);
    console.log('Global task refresh triggered');
  }, []);

  // Function to trigger activity data refresh across all components
  const triggerActivityRefresh = useCallback(() => {
    setActivityRefreshTrigger(prev => prev + 1);
    console.log('Global activity refresh triggered');
  }, []);

  // Function to trigger alarm data refresh across all components
  const triggerAlarmRefresh = useCallback(() => {
    setAlarmRefreshTrigger(prev => prev + 1);
    console.log('Global alarm refresh triggered');
  }, []);

  // Function to trigger all data refresh
  const triggerAllRefresh = useCallback(() => {
    setTaskRefreshTrigger(prev => prev + 1);
    setActivityRefreshTrigger(prev => prev + 1);
    setAlarmRefreshTrigger(prev => prev + 1);
    console.log('Global all data refresh triggered');
  }, []);

  const value = {
    // Trigger values
    taskRefreshTrigger,
    activityRefreshTrigger,
    alarmRefreshTrigger,
    
    // Trigger functions
    triggerTaskRefresh,
    triggerActivityRefresh,
    triggerAlarmRefresh,
    triggerAllRefresh,
  };

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export default DataRefreshContext;
