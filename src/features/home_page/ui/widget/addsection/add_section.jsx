import styles from './add_section.module.css';
import Tugas from '/assets/home/addtask.svg';
import Aktivitas from '/assets/home/addactivity.svg';
import Settings from '/assets/icons/settings.svg';
import AddEditForm from '../../../../crudtask/screen/addeditform.jsx';
import Toast from '../../../../../core/widgets/toast/toast.jsx';
import { createTask } from '../../../../../core/services/api/task_api_service.js';
import { createActivity } from '../../../../../core/services/api/activity_api_service.js';
import React from 'react';
import ActivityCrudPage from '../../../../crudactivity/screen/activity-crud-page.jsx';
import UserPreference from '../../../../user_preference/screen/user-preference.jsx';

function AddSection({ onTaskAdded }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastConfig, setToastConfig] = React.useState({ title: '', message: '' });
  const [isActivityModalOpen, setIsActivityModalOpen] = React.useState(false);
  const [isUserPreferenceOpen, setIsUserPreferenceOpen] = React.useState(false);

  // Debug log untuk track state changes
  React.useEffect(() => {
    console.log('AddSection: showToast changed to:', showToast);
  }, [showToast]);

  React.useEffect(() => {
    console.log('AddSection: toastConfig changed to:', toastConfig);
  }, [toastConfig]);
  
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
    setIsFormOpen(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Handle task save
  const handleTaskSave = async (taskData) => {
    try {
      console.log('Saving task from home page:', taskData);
      
      // Prepare data for API (matching the format expected by createTask)
      const apiData = {
        title: taskData.task_title,
        description: taskData.task_description,
        deadline: taskData.task_deadline,
        estimatedDuration: taskData.estimated_task_duration,
        category: taskData.task_category,
        status: taskData.task_status || 'belum_selesai'
      };
      
      console.log('API Data being sent:', apiData);
      
      // Call API to create task
      const response = await createTask(apiData);
      console.log('Task created successfully:', response);
      
      // Call the callback to refresh the task list if provided
      if (onTaskAdded) {
        onTaskAdded();
      }
      
      // Form will handle success toast via onSuccess callback
      // Close the form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving task from home page:', error);
      console.error('Error details:', error.response?.data);
      
      // Re-throw error so form can handle it via onError callback
      throw error;
    }
  };

  // Handle toast close - use useCallback to prevent re-renders
  const handleToastClose = React.useCallback(() => {
    console.log('Toast close called');
    setShowToast(false);
  }, []);

  // Handle add activity button click
  const handleAddActivity = () => {
    setIsActivityModalOpen(true);
  };

  // Handle user preference button click
  const handleUserPreferenceClick = () => {
    setIsUserPreferenceOpen(true);
  };

  // Handle user preference save
  const handleUserPreferenceSave = async (preferenceData) => {
    try {
      // TODO: Implement API call to save user preferences
      console.log('Saving user preferences:', preferenceData);
      
      setToastConfig({ 
        title: 'Berhasil', 
        message: 'Preferensi pengguna berhasil disimpan' 
      });
      setShowToast(true);
      setIsUserPreferenceOpen(false);
    } catch (error) {
      setToastConfig({ 
        title: 'Gagal', 
        message: error.message || 'Gagal menyimpan preferensi pengguna' 
      });
      setShowToast(true);
    }
  };

  // Simpan aktivitas ke backend dan tampilkan toast
  const handleActivitySave = async (activityData) => {
    try {
      await createActivity(activityData);
      setIsActivityModalOpen(false);
      setToastConfig({ title: 'Berhasil', message: 'Aktivitas berhasil ditambahkan' });
      setShowToast(true);
      if (onTaskAdded) onTaskAdded();
    } catch (error) {
      setToastConfig({ title: 'Gagal', message: error.message || 'Gagal menambahkan aktivitas' });
      setShowToast(true);
    }
  };

  return (
    <>
      <div className={styles.addSection}>
        <button 
          className={styles.addTask + ' ' + styles.purpleButton}
          onClick={handleUserPreferenceClick}
        >
          <img src={Settings} alt="Settings" className={styles.whiteIcon} />
          {'Preferensi Pengguna'}
        </button>
        <button 
          className={styles.addTask + ' ' + styles.purpleButton}
          onClick={handleAddTaskClick}
        >
          <img src={Tugas} alt="Tugas" className={styles.whiteIcon} />
          {'Tambah Tugas'}
        </button>
        <button 
          className={styles.addActivity + ' ' + styles.purpleButton}
          onClick={handleAddActivity}
        >
          <img src={Aktivitas} alt="Aktivitas" className={styles.whiteIcon} />
          {'Tambah Aktivitas'}
        </button>
      </div>
      {/* Modal Tambah Aktivitas */}
      <ActivityCrudPage
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleActivitySave}
        activity={null}
      />

      {/* User Preference Modal */}
      <UserPreference
        isOpen={isUserPreferenceOpen}
        onClose={() => setIsUserPreferenceOpen(false)}
        onSave={handleUserPreferenceSave}
      />

      {/* Add/Edit Form Popup */}
      <AddEditForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleTaskSave}
        onSuccess={({ title, message }) => {
          console.log('AddSection: Success callback called:', { title, message });
          setToastConfig({ title, message });
          setShowToast(true);
          console.log('AddSection: Toast state set to true');
        }}
        onError={({ title, message }) => {
          console.log('AddSection: Error callback called:', { title, message });
          setToastConfig({ title, message });
          setShowToast(true);
          console.log('AddSection: Toast state set to true (error)');
        }}
        onDataChanged={() => {
          // Trigger real-time data refresh
          if (onTaskAdded) {
            onTaskAdded();
          }
        }}
        task={null} // null for add mode
      />

      {/* Toast Notification */}
      <Toast
        isOpen={showToast}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={handleToastClose}
        duration={3000}
      />
    </>
  );
}
export default AddSection;
