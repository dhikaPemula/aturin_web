import React, { useState, useRef, useEffect } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { createPortal } from "react-dom";
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
import { updateTask } from "../../../../core/services/api/task_api_service";
import { useGlobalTaskRefresh } from "../../../../core/hooks/useGlobalTaskRefresh";

function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showToastNotification, setShowToastNotification] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });
  const [activeTask, setActiveTask] = useState(null);
  const [pointerPercentInList, setPointerPercentInList] = useState(null);
  const [dynamicThresholdY, setDynamicThresholdY] = useState(0.3);

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    refreshTasks,
  } = useTaskList();

  const { triggerTaskRefresh } = useGlobalTaskRefresh();

  useTaskAutoRefresh(refreshTasks);

  const displayToast = (config) => {
    setToastConfig(config);
    setShowToastNotification(true);
  };

  const { handleDragEnd } = useDndKitTaskDrag(displayToast);

  // Custom scroll
  const isDraggingRef = useRef(false);
  const scrollAnimationRef = useRef(null);
  const shouldScrollRef = useRef(false);
  const listSectionRef = useRef(null);

  const scrollStep = () => {
    if (shouldScrollRef.current) {
      window.scrollBy({ top: 24, behavior: "auto" });
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    }
  };

  const handleDragStart = (event) => {
    const taskData = event.active.data.current?.task;
    setActiveTask(taskData);
    isDraggingRef.current = true;
  };

  const handleDragMove = (event) => {
    if (!isDraggingRef.current || !event?.activatorEvent) return;
    const y = event.activatorEvent.clientY;
    // Hitung persentase posisi pointer terhadap tinggi listSection
    if (listSectionRef.current) {
      const rect = listSectionRef.current.getBoundingClientRect();
      const pointerRelativeToContainer = y - rect.top;
      const percentInContainer = Math.max(0, Math.min(1, pointerRelativeToContainer / rect.height));
      setPointerPercentInList(percentInContainer);
      // Konversi: jika pointer di 20% atas layar, threshold y = persentase pointer di container
      const windowHeight = window.innerHeight;
      if (y < windowHeight * 0.2) {
        setDynamicThresholdY(percentInContainer);
      } else if (y > windowHeight * 0.8) {
        setDynamicThresholdY(1 - percentInContainer);
      } else {
        setDynamicThresholdY(0.3); // default
      }
    } else {
      setPointerPercentInList(null);
      setDynamicThresholdY(0.3);
    }
    // ...existing autoscroll logic...
    const windowHeight = window.innerHeight;
    const bottomThreshold = windowHeight * 0.75;
    if (y > bottomThreshold) {
      if (!shouldScrollRef.current) {
        shouldScrollRef.current = true;
        scrollAnimationRef.current = requestAnimationFrame(scrollStep);
      }
    } else {
      if (shouldScrollRef.current) {
        shouldScrollRef.current = false;
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
          scrollAnimationRef.current = null;
        }
      }
    }
  };

  const handleDragEndWithOverlay = (event) => {
    isDraggingRef.current = false;
    shouldScrollRef.current = false;
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    handleDragEnd(event);
    setActiveTask(null);
  };

  const handleSearchChange = (query) => setSearchQuery(query);
  const handleStatusChange = (status) => setStatusFilter(status);
  const handleCategoryChange = (category) => setCategoryFilter(category);
  const handleAddNewTask = () => {
    setTaskToEdit(null);
    setIsAddEditFormOpen(true);
  };
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsAddEditFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    try {
      const result = await deleteTask(task.slug);
      if (result.success) return result;
      else throw new Error(result.error || "Gagal menghapus tugas");
    } catch (error) {
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
        const updateData = {
          title: taskData.task_title,
          description: taskData.task_description,
          deadline: taskData.task_deadline,
          category: taskData.task_category,
          status: taskData.task_status,
        };
        if (
          taskData.estimated_task_duration &&
          taskData.estimated_task_duration.trim() !== ""
        ) {
          updateData.estimatedDuration = taskData.estimated_task_duration;
        }
        result = await updateTask(taskToEdit.slug, updateData);
      } else {
        const createData = {
          title: taskData.task_title,
          description: taskData.task_description,
          deadline: taskData.task_deadline,
          category: taskData.task_category,
          status: taskData.task_status || "belum_selesai",
        };
        if (
          taskData.estimated_task_duration &&
          taskData.estimated_task_duration.trim() !== ""
        ) {
          createData.estimatedDuration = taskData.estimated_task_duration;
        }
        result = await createTask(createData);
      }

      if (result.success) handleCloseAddEditForm();
      else
        console.error("Failed to save task:", result.error || "Unknown error");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handler untuk toggle status dari TaskCard
  const handleToggleStatus = async (task) => {
    try {
      await updateTask(task.slug, { status: task.status });
      displayToast({
        type: 'success',
        title: 'Status Tugas Diperbarui',
        message: `Status tugas \"${task.title || task.task_title}\" berhasil diubah menjadi ${task.status.replace('_', ' ')}`
      });
      triggerTaskRefresh();
    } catch (err) {
      displayToast({
        type: 'error',
        title: 'Gagal Update Status',
        message: 'Terjadi kesalahan saat mengubah status tugas.'
      });
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

        {/* Filtering section tetap di luar DndContext */}
        <div className={styles.filteringSection}>
          <div className={styles.searchSection}>
            <Search
              onSearchChange={handleSearchChange}
              placeholder="Cari tugas..."
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

        {/* DndContext hanya membungkus listSection */}
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndWithOverlay}
          onDragMove={handleDragMove}
          autoScroll={{
            threshold: { x: 0, y: 0.4 },
            acceleration: 300,
            activator: 1,
            interval: 1,
            layoutShiftCompensation: false,
            order: 0,
            enabled: true,
          }}
        >
          <div className={styles.listSection} ref={listSectionRef}>
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
              onToggleStatus={handleToggleStatus}
            />
            {/* Print persentase pointer di DndContext
            {pointerPercentInList !== null && (
              <div style={{textAlign: 'center', color: '#5263F3', fontWeight: 600, margin: '16px 0'}}>
                Posisi pointer di DndContext: {(pointerPercentInList * 100).toFixed(1)}%
              </div>
            )} */}
            {createPortal(
              <DragOverlay adjustScale={false} dropAnimation={null}>
                {activeTask && (
                  <div
                    style={{
                      transformOrigin: "0 0",
                      opacity: 1,
                      background: "transparent",
                      borderRadius: "8px",
                      pointerEvents: "none",
                      cursor: "grabbing",
                      zIndex: 99999,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <TaskCard
                      task={activeTask}
                      isDraggable={false}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onDeleteSuccess={displayToast}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                )}
              </DragOverlay>,
              document.body
            )}
          </div>
        </DndContext>
      </div>

      <AddEditForm
        isOpen={isAddEditFormOpen}
        onClose={handleCloseAddEditForm}
        task={taskToEdit}
        onSave={handleSaveTask}
        onSuccess={displayToast}
        onError={displayToast}
      />

      <Toast
        isOpen={showToastNotification}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={() => setShowToastNotification(false)}
        duration={3000}
      />
    </div>
  );
}

export default TaskPage;
