import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCenter, pointerWithin } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import styles from "./task_page.module.css";
import useTaskList from "../../../../core/hooks/useTaskList.js";
import useProfile from "../../../../core/hooks/useProfile.js";
import { useTaskAutoRefresh } from "../../../../core/hooks/useGlobalTaskRefresh";
import { useDndKitTaskDrag } from "../../../../core/hooks/useDndKitTaskDrag.js";
import Badge from "../../../../core/widgets/badge/buildbadge/badge.jsx";
import StatusBadge from "../../../../core/widgets/status/statusbadge.jsx";
import UpperSection from "../widget/uppersection/uppersection.jsx";
import AddSection from "../widget/addbutton/addbutton.jsx";
import Search from "../widget/search/search.jsx";
import StatusFilter from "../widget/statusfilter/statusfilter.jsx";
import CategoryFilter from "../widget/categoryfilter/categoryfilter.jsx";
import List from "../widget/list/list.jsx";
import AddEditForm from "../../../crudtask/screen/addeditform.jsx";
import Toast from "../../../../core/widgets/toast/toast.jsx";
import TaskCard from "../widget/taskcard/taskcard.jsx";
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
  const [showToastNotification, setShowToastNotification] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: 'success',
    title: '',
    message: ''
  });
  const [activeTask, setActiveTask] = useState(null);

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
    clearError,
    refreshTasks
  } = useTaskList();

  // Auto-refresh tasks menggunakan global trigger
  useTaskAutoRefresh(refreshTasks);

  // Toast notification functions
  const displayToast = (config) => {
    setToastConfig(config);
    setShowToastNotification(true);
  };

  // DndKit drag handler
  const { handleDragEnd } = useDndKitTaskDrag(displayToast);

  // Handle drag start for overlay
  const handleDragStart = (event) => {
    const taskData = event.active.data.current?.task;
    console.log('Drag start - taskData:', taskData);
    console.log('Categories:', taskData?.categories);
    console.log('Task category:', taskData?.task_category);
    setActiveTask(taskData);
  };

  // Handle drag end and reset overlay
  const handleDragEndWithOverlay = (event) => {
    handleDragEnd(event);
    setActiveTask(null);
  };

  const handleToastSuccess = (config) => {
    displayToast(config);
  };

  const handleToastError = (config) => {
    displayToast(config);
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
    try {
      const result = await deleteTask(task.slug);
      if (result.success) {
        // Success akan ditangani oleh callback onDeleteSuccess di TaskCard
        return result;
      } else {
        throw new Error(result.error || 'Gagal menghapus tugas');
      }
    } catch (error) {
      // Error akan ditangani oleh TaskCard
      throw error;
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
        // Success will be handled by onSuccess callback from form
        handleCloseAddEditForm();
      } else {
        // Error handling - could also be moved to onError callback
        console.error('Failed to save task:', result.error || 'Unknown error');
        // displayToast({
        //   title: 'Gagal Menyimpan Tugas',
        //   message: result.error || 'Terjadi kesalahan saat menyimpan tugas'
        // });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      // displayToast({
      //   title: 'Gagal Menyimpan Tugas',
      //   message: 'Terjadi kesalahan saat menyimpan tugas'
      // });
    }
  };

  return (
    <DndContext 
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWithOverlay}
    >
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
              onDeleteSuccess={displayToast}
            />
          </div>
        </div>

        {/* Drag Overlay using Portal */}
        {createPortal(
          <DragOverlay 
            adjustScale={false}
            dropAnimation={null}
            style={{
              transformOrigin: '0 0',
            }}
          >
            {activeTask ? (
              <div style={{
                opacity: 1,
                transform: 'rotate(0deg)', // Rotasi lebih kecil
                transformOrigin: 'center center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                background: 'white',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                width: 'auto',
                height: 'auto',
                pointerEvents: 'none',
                cursor: 'grabbing',
                zIndex: 99999,
                position: 'relative',
                willChange: 'transform',
                margin: '0',
                padding: '0',
                // Offset yang disesuaikan untuk posisi yang lebih tepat
                marginTop: '0px', // Sedikit ke bawah dari center
                marginLeft: '0px', // Sedikit ke kanan dari center
                overflow: 'hidden' // Mencegah content overflow
              }}>
                <TaskCard 
                  task={activeTask}
                  isDraggable={false}
                  className="dragOverlay"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onDeleteSuccess={displayToast}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}

        {/* Add/Edit Form Modal */}
        <AddEditForm 
          isOpen={isAddEditFormOpen}
          onClose={handleCloseAddEditForm}
          task={taskToEdit}
          onSave={handleSaveTask}
          onSuccess={handleToastSuccess}
          onError={handleToastError}
        />

        {/* Toast Component */}
        <Toast
          isOpen={showToastNotification}
          title={toastConfig.title}
          message={toastConfig.message}
          onClose={() => setShowToastNotification(false)}
          duration={3000}
        />
      </div>
    </DndContext>
  );
}

export default TaskPage;
