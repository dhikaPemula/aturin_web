import { useEffect, useState, useCallback } from 'react';
import {
  getAllTasks,
  getTasksToday,
  getUncompletedTasksToday,
  getTaskBySlug,
  createTask,
  updateTask,
  deleteTask,
  getDashboardSummary,
  countLateTasks,
  getTasksByStatus
} from '../services/api/task_api_service';

export default function useTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Gagal mengambil data tugas');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch today's tasks
  const fetchTasksToday = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksToday();
      setTasks(data);
    } catch (err) {
      setError('Gagal mengambil data tugas hari ini');
      console.error('Error fetching today tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch uncompleted tasks today
  const fetchUncompletedTasksToday = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUncompletedTasksToday();
      setTasks(data);
    } catch (err) {
      setError('Gagal mengambil data tugas yang belum selesai hari ini');
      console.error('Error fetching uncompleted today tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new task
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createTask(taskData);
      
      // Refresh tasks after creating
      await fetchTasks();
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal membuat tugas baru';
      setError(errorMessage);
      console.error('Error creating task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Update task
  const handleUpdateTask = useCallback(async (slug, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateTask(slug, updateData);
      
      // Refresh tasks after updating
      await fetchTasks();
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengupdate tugas';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Delete task
  const handleDeleteTask = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(slug);
      
      // Refresh tasks after deleting
      await fetchTasks();
      
      return { success: true, message: 'Tugas berhasil dihapus' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menghapus tugas';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Get task by slug
  const getTask = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTaskBySlug(slug);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil detail tugas';
      setError(errorMessage);
      console.error('Error getting task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard summary
  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardSummary();
      setDashboardSummary(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil ringkasan dashboard';
      setError(errorMessage);
      console.error('Error fetching dashboard summary:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Count late tasks
  const fetchLateTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await countLateTasks();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil jumlah tugas terlambat';
      setError(errorMessage);
      console.error('Error counting late tasks:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get tasks by status
  const fetchTasksByStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksByStatus(status);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengambil tugas berdasarkan status';
      setError(errorMessage);
      console.error('Error getting tasks by status:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks,
    loading,
    error,
    dashboardSummary,
    
    // Actions
    clearError,
    fetchTasks,
    fetchTasksToday,
    fetchUncompletedTasksToday,
    fetchDashboardSummary,
    fetchLateTasks,
    fetchTasksByStatus,
    
    // CRUD operations
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    getTask,
  };
}
