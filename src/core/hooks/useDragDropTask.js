import { useCallback } from 'react';
import { updateTask } from '../services/api/task_api_service';
import { useGlobalTaskRefresh } from './useGlobalTaskRefresh';

export const useDragDropTask = (onToastSuccess) => {
  const { triggerTaskRefresh } = useGlobalTaskRefresh();

  const handleDropTask = useCallback(async (taskItem, targetStatus) => {
    // Don't do anything if dropping on the same status
    if (taskItem.task_status === targetStatus) {
      return;
    }

    try {
      // Update task status via API
      await updateTask(taskItem.slug, {
        status: targetStatus
      });

      // Show success toast via callback
      if (onToastSuccess) {
        onToastSuccess({
          type: 'success',
          title: 'Berhasil Memperbarui Status',
          message: `Tugas "${taskItem.title || taskItem.task_title}" berhasil dipindahkan ke ${getStatusLabel(targetStatus)}`
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
    handleDropTask
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
