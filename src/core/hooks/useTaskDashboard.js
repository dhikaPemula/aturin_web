import { useEffect, useState, useCallback } from 'react';
import {
  getDashboardSummary,
  countLateTasks,
  getTasksByStatus,
  getTasksToday,
  getUncompletedTasksToday
} from '../services/api/task_api_service';

export default function useTaskDashboard() {
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    todayTasks: [],
    uncompletedToday: [],
    lateTasksCount: null,
    tasksByStatus: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua data dashboard secara paralel
      const [
        summaryResult,
        todayTasksResult,
        uncompletedTodayResult,
        lateTasksResult
      ] = await Promise.allSettled([
        getDashboardSummary(),
        getTasksToday(),
        getUncompletedTasksToday(),
        countLateTasks()
      ]);

      setDashboardData({
        summary: summaryResult.status === 'fulfilled' ? summaryResult.value : null,
        todayTasks: todayTasksResult.status === 'fulfilled' ? todayTasksResult.value : [],
        uncompletedToday: uncompletedTodayResult.status === 'fulfilled' ? uncompletedTodayResult.value : [],
        lateTasksCount: lateTasksResult.status === 'fulfilled' ? lateTasksResult.value : null,
        tasksByStatus: {}
      });

    } catch (err) {
      setError('Gagal mengambil data dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks by specific status
  const fetchTasksBySpecificStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksByStatus(status);
      
      setDashboardData(prev => ({
        ...prev,
        tasksByStatus: {
          ...prev.tasksByStatus,
          [status]: data
        }
      }));

      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Gagal mengambil tugas dengan status ${status}`;
      setError(errorMessage);
      console.error('Error fetching tasks by status:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh specific part of dashboard
  const refreshSummary = useCallback(async () => {
    try {
      const data = await getDashboardSummary();
      setDashboardData(prev => ({ ...prev, summary: data }));
      return data;
    } catch (err) {
      console.error('Error refreshing summary:', err);
      throw err;
    }
  }, []);

  const refreshTodayTasks = useCallback(async () => {
    try {
      const data = await getTasksToday();
      setDashboardData(prev => ({ ...prev, todayTasks: data }));
      return data;
    } catch (err) {
      console.error('Error refreshing today tasks:', err);
      throw err;
    }
  }, []);

  const refreshUncompletedToday = useCallback(async () => {
    try {
      const data = await getUncompletedTasksToday();
      setDashboardData(prev => ({ ...prev, uncompletedToday: data }));
      return data;
    } catch (err) {
      console.error('Error refreshing uncompleted today:', err);
      throw err;
    }
  }, []);

  const refreshLateTasksCount = useCallback(async () => {
    try {
      const data = await countLateTasks();
      setDashboardData(prev => ({ ...prev, lateTasksCount: data }));
      return data;
    } catch (err) {
      console.error('Error refreshing late tasks count:', err);
      throw err;
    }
  }, []);

  // Get task counts for TaskCount component
  const getTaskCounts = useCallback(() => {
    const { summary, lateTasksCount, uncompletedToday } = dashboardData;
    
    return {
      total: summary?.total_tasks || 0,
      completed: summary?.completed_tasks || 0,
      uncompleted: uncompletedToday?.length || 0,
      late: lateTasksCount?.late_tasks_count || 0
    };
  }, [dashboardData]);

  // Auto fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // State
    dashboardData,
    loading,
    error,
    
    // Computed data
    taskCounts: getTaskCounts(),
    
    // Actions
    clearError,
    fetchDashboardData,
    fetchTasksBySpecificStatus,
    
    // Refresh functions
    refreshSummary,
    refreshTodayTasks,
    refreshUncompletedToday,
    refreshLateTasksCount,
  };
}
