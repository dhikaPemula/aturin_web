// Drag and Drop Item Types
export const ItemTypes = {
  TASK: 'task', // Keep consistent with TaskCard usage
  TASK_CARD: 'task_card',
};

// Drag and Drop Status Mappings
export const DragDropStatuses = {
  BELUM_SELESAI: 'belum_selesai',
  SELESAI: 'selesai',
  TERLAMBAT: 'terlambat',
  BELUM_DIKERJAKAN: 'belum_dikerjakan',
};

// Helper function to get valid statuses for dropping
export const getValidDropStatuses = () => {
  return Object.values(DragDropStatuses);
};

// Helper function to check if a status is valid for dropping
export const isValidDropStatus = (status) => {
  return getValidDropStatuses().includes(status);
};
