import styles from './addbutton.module.css';
import Tugas from '../../../../../assets/home/addtask.svg';
import Aktivitas from '../../../../../assets/home/addactivity.svg';
import AddEditForm from '../../../../crudtask/screen/addeditform.jsx';
import React from 'react';

function AddSection({ onAddTask, onTaskAdded }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  
  // Cek jika layar <= 640px (max-sm)
  const isMaxSm = typeof window !== 'undefined' && window.innerWidth <= 640;
  const [maxSm, setMaxSm] = React.useState(isMaxSm);

  React.useEffect(() => {
    const handleResize = () => setMaxSm(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle add task button click
  const handleAddTaskClick = () => {
    if (onAddTask) {
      onAddTask(); // Use parent handler if provided
    } else {
      setIsFormOpen(true); // Fallback to local state
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Handle task save
  const handleTaskSave = async (taskData) => {
    try {
      // Here you would typically call an API to save the task
      // For now, we'll just log it and call the callback
      console.log('Saving task:', taskData);
      
      // Call the callback to refresh the task list
      if (onTaskAdded) {
        onTaskAdded();
      }
      
      // Close the form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <>
      <div className={styles.addSection}>
        <button 
          className={styles.addTask + ' ' + styles.purpleButton}
          onClick={handleAddTaskClick}
        >
          <img src={Tugas} alt="Tugas" className={styles.whiteIcon} />
          {'Tambah Tugas'}
        </button>
      </div>

      {/* Add/Edit Form Popup */}
      <AddEditForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleTaskSave}
        task={null} // null for add mode
      />
    </>
  );
}
export default AddSection;
