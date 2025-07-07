import { useEffect, useState, useCallback } from 'react';
import { useDataRefresh } from '../context/DataRefreshContext';

/**
 * Custom hook untuk mengelola global task refresh
 * Hook ini akan membantu komponen untuk:
 * 1. Subscribe ke global task refresh trigger
 * 2. Trigger global task refresh
 * 3. Mengelola loading state secara global
 */
export const useGlobalTaskRefresh = () => {
  const { taskRefreshTrigger, triggerTaskRefresh } = useDataRefresh();
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  // Function untuk trigger refresh dengan loading state
  const triggerRefreshWithLoading = useCallback(async () => {
    setIsGlobalLoading(true);
    triggerTaskRefresh();
    
    // Small delay to allow components to start fetching
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, 500);
  }, [triggerTaskRefresh]);

  return {
    taskRefreshTrigger,
    triggerTaskRefresh,
    triggerRefreshWithLoading,
    isGlobalLoading
  };
};

/**
 * Custom hook untuk auto-refresh task data ketika trigger berubah
 * @param {Function} fetchFunction - Function untuk fetch data
 * @param {Array} dependencies - Dependencies untuk useEffect (opsional)
 */
export const useTaskAutoRefresh = (fetchFunction, dependencies = []) => {
  const { taskRefreshTrigger } = useDataRefresh();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchFunction) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        await fetchFunction();
      } catch (err) {
        setError(err);
        console.error('Error in auto-refresh:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [taskRefreshTrigger, ...dependencies]);

  return { isLoading, error };
};

export default useGlobalTaskRefresh;
