import React, { useState, useEffect } from "react";
import styles from "./task_page.module.css";
import useTaskList from "../../../../core/hooks/useTaskList.js";
import useProfile from "../../../../core/hooks/useProfile.js";
import Badge from "../../../../core/widgets/badge/buildbadge/badge.jsx";
import StatusBadge from "../../../../core/widgets/status/statusbadge.jsx";
import UpperSection from "../widget/uppersection/uppersection.jsx";
import AddSection from "../widget/addbutton/addbutton.jsx";
import Search from "../widget/search/search.jsx";
import StatusFilter from "../widget/statusfilter/statusfilter.jsx";
import CategoryFilter from "../widget/categoryfilter/categoryfilter.jsx";
import List from "../widget/list/list.jsx";
import AddEditForm from "../../../crudtask/screen/addeditform.jsx";
// Import icons
import clockIcon from "../../../../assets/home/clock.svg";
import jadwalIcon from "../../../../assets/home/jadwal.svg";
import checkCircleIcon from "../../../../assets/home/check-circle.svg";
import warningCircleIcon from "../../../../assets/home/warning-circle.svg";

function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  // Get user profile data
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  // Use the task list hook
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearError
  } = useTaskList();

  // Toast helper function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    console.log("Status filter:", status);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    console.log("Category filter:", category);
  };

  const handleAddNewTask = () => {
    setTaskToEdit(null);
    setIsAddEditFormOpen(true);
  };

  const handleEditTask = (task) => {
    console.log("Edit task:", task);
    setTaskToEdit(task);
    setIsAddEditFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    console.log("Delete task:", task);
    const result = await deleteTask(task.slug);
    if (result.success) {
      showToast('Tugas berhasil dihapus', 'success');
    } else {
      showToast(result.error || 'Gagal menghapus tugas', 'error');
    }
  };

  const handleCloseAddEditForm = () => {
    setIsAddEditFormOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      let result;
      
      if (taskToEdit) {
        // Update existing task
        const updateData = {
          title: taskData.task_title,
          description: taskData.task_description,
          deadline: taskData.task_deadline,
          category: taskData.task_category,
          status: taskData.task_status
        };
        
        // Only include estimatedDuration if it's not empty
        if (taskData.estimated_task_duration && taskData.estimated_task_duration.trim() !== '') {
          updateData.estimatedDuration = taskData.estimated_task_duration;
        }
        
        console.log('Sending update data:', updateData);
        result = await updateTask(taskToEdit.slug, updateData);
      } else {
        // Create new task
        const createData = {
          title: taskData.task_title,
          description: taskData.task_description,
          deadline: taskData.task_deadline,
          category: taskData.task_category,
          status: taskData.task_status || 'belum_selesai'
        };
        
        // Only include estimatedDuration if it's not empty
        if (taskData.estimated_task_duration && taskData.estimated_task_duration.trim() !== '') {
          createData.estimatedDuration = taskData.estimated_task_duration;
        }
        
        console.log('Sending create data:', createData);
        result = await createTask(createData);
      }

      if (result.success) {
        showToast(
          taskToEdit ? 'Tugas berhasil diperbarui' : 'Tugas berhasil ditambahkan', 
          'success'
        );
        handleCloseAddEditForm();
      } else {
        showToast(result.error || 'Gagal menyimpan tugas', 'error');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      showToast('Terjadi kesalahan saat menyimpan tugas', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.upperSection}>
          <div className={styles.tugas}>
            <UpperSection />
          </div>
          <div className={styles.addSection}>
            <AddSection onAddTask={handleAddNewTask} />
          </div>
        </div>
        <div className={styles.filteringSection}>
          <div className={styles.searchSection}>
            <Search
              onSearchChange={handleSearchChange}
              placeholder="Mencari Tugas..."
            />
          </div>
          <div className={styles.filterSection}>
            <StatusFilter
              onStatusChange={handleStatusChange}
              placeholder="Semua status"
            />
          </div>
          <div className={styles.categorySection}>
            <CategoryFilter
              onCategoryChange={handleCategoryChange}
              placeholder="Semua kategori"
            />
          </div>
        </div>
        <div className={styles.listSection}>
          <List
            tasks={tasks}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            currentStatus={statusFilter}
            currentCategory={categoryFilter}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AddEditForm 
        isOpen={isAddEditFormOpen}
        onClose={handleCloseAddEditForm}
        task={taskToEdit}
        onSave={handleSaveTask}
      />

      <p>
        Query Search: <strong>"{searchQuery}"</strong>
      </p>
      <p>
        Status Filter: <strong>"{statusFilter || "Semua status"}"</strong>
      </p>
      <p>
        Category Filter: <strong>"{categoryFilter || "Semua kategori"}"</strong>
      </p>
    </div>
  );
}

export default TaskPage;
