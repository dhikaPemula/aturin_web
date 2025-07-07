import { useCallback } from 'react';
import { updateTask } from '../services/api/task_api_service';
import { useGlobalTaskRefresh } from './useGlobalTaskRefresh';

export const useDndKitTaskDrag = (onToastSuccess) => {
  const { triggerTaskRefresh } = useGlobalTaskRefresh();

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    
    if (!over) {
      console.log('No drop target');
      return;
    }

    // Parse the dragged task data
    const taskData = active.data.current?.task;
    if (!taskData) {
      console.warn('No task data found');
      return;
    }

    // Get target status from droppable area
    const targetStatus = over.data.current?.status || over.id;
    
    // Don't do anything if dropping on the same status
    if (taskData.task_status === targetStatus) {
      console.log('Same status, no action needed');
      return;
    }

    try {
      console.log('Updating task status:', {
        task: taskData.task_title || taskData.title,
        from: taskData.task_status,
        to: targetStatus
      });

      // Update task status via API
      await updateTask(taskData.slug, {
        status: targetStatus
      });

      // Show success toast via callback
      if (onToastSuccess) {
        onToastSuccess({
          type: 'success',
          title: 'Berhasil Memperbarui Status',
          message: `Tugas "${taskData.title || taskData.task_title}" berhasil dipindahkan ke ${getStatusLabel(targetStatus)}`
        });
      }

      // Trigger global refresh to update all components
      triggerTaskRefresh();

    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Show error toast via callback
      if (onToastSuccess) {
        onToastSuccess({
          type: 'error',
          title: 'Gagal Memperbarui Status',
          message: 'Terjadi kesalahan saat memperbarui status tugas'
        });
      }
    }
  }, [triggerTaskRefresh, onToastSuccess]);

  return {
    handleDragEnd
  };
};

// Helper function to get status label for toast message
const getStatusLabel = (status) => {
  const statusLabels = {
    'belum_selesai': 'Belum Selesai',
    'selesai': 'Selesai', 
    'terlambat': 'Terlambat',
    'belum_dikerjakan': 'Belum Dikerjakan'
  };
  return statusLabels[status] || status;
};
