import { useEffect, useState, useCallback } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/api/task_api_service';

export default function useTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Create new task
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createTask(taskData);
      
      // Add new task to the list
      setTasks(prev => [result.data, ...prev]);
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal membuat tugas baru';
      setError(errorMessage);
      console.error('Error creating task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update task
  const handleUpdateTask = useCallback(async (slug, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateTask(slug, updateData);
      
      // Update task in the list
      setTasks(prev => prev.map(task => 
        task.slug === slug ? { ...task, ...result.data } : task
      ));
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengupdate tugas';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete task
  const handleDeleteTask = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(slug);
      
      // Remove task from the list
      setTasks(prev => prev.filter(task => task.slug !== slug));
      
      return { success: true, message: 'Tugas berhasil dihapus' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menghapus tugas';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (slug) => {
    const task = tasks.find(t => t.slug === slug);
    if (!task) return { success: false, error: 'Tugas tidak ditemukan' };

    const newStatus = task.task_status === 'selesai' ? 'belum_selesai' : 'selesai';
    return handleUpdateTask(slug, { status: newStatus });
  }, [tasks, handleUpdateTask]);

  // Auto fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks,
    loading,
    error,
    
    // Actions
    clearError,
    fetchTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleTaskStatus,
  };
}
