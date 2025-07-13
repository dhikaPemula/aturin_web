import React, { useState, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
} from "@dnd-kit/core";
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

import clockIcon from "../../../../assets/home/clock.svg";
import jadwalIcon from "../../../../assets/home/jadwal.svg";
import checkCircleIcon from "../../../../assets/home/check-circle.svg";
import warningCircleIcon from "../../../../assets/home/warning-circle.svg";

// Autoscroll manual dengan sensitivitas bisa diatur
const AUTOSCROLL_MARGIN = 80; // px dari tepi atas/bawah window
const AUTOSCROLL_SPEED = 24; // px per event

// Responsive autoScroll threshold (1 untuk desktop, 0.3 untuk md)
const getAutoScrollThreshold = () => {
  if (typeof window !== "undefined" && window.innerWidth <= 900) {
    return 0.4;
  }
  return 0.2;
};

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
  const [autoScrollThreshold, setAutoScrollThreshold] = useState(
    getAutoScrollThreshold()
  );

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

  useTaskAutoRefresh(refreshTasks);

  const displayToast = (config) => {
    setToastConfig(config);
    setShowToastNotification(true);
  };

  const { handleDragEnd } = useDndKitTaskDrag(displayToast);

  // Custom autoscroll: scroll window ke bawah dengan requestAnimationFrame jika user hold drag card di 25% bawah layar
  const isDraggingRef = useRef(false);
  const scrollAnimationRef = useRef(null);
  const shouldScrollRef = useRef(false);

  const handleDragStart = (event) => {
    const taskData = event.active.data.current?.task;
    setActiveTask(taskData);
    isDraggingRef.current = true;
  };

  // Fungsi scroll animasi
  const scrollStep = () => {
    if (shouldScrollRef.current) {
      window.scrollBy({ top: 24, behavior: "auto" });
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    }
  };

  const handleDragMove = (event) => {
    if (!isDraggingRef.current) return;
    if (!event || !event.activatorEvent) return;
    const y = event.activatorEvent.clientY;
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

  // Stop autoscroll saat drag selesai
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

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

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
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || "Gagal menghapus tugas");
      }
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

      if (result.success) {
        handleCloseAddEditForm();
      } else {
        console.error("Failed to save task:", result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  React.useEffect(() => {
    const handleResize = () => setAutoScrollThreshold(getAutoScrollThreshold());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWithOverlay}
      onDragMove={handleDragMove}
      autoScroll={{
        threshold: { x: 0, y: autoScrollThreshold }, // responsif: 1 (desktop), 0.3 (md)
        acceleration: 500, // percepatan scroll (default 1, makin besar makin cepat)
        activator: 1, // 0 = Pointer, 1 = DraggableRect
        interval: 5, // ms, interval scroll (default 5)
        layoutShiftCompensation: true, // kompensasi layout shift
        order: 0, // 0 = TreeOrder, 1 = ReversedTreeOrder
        enabled: true, // aktifkan autoscroll
      }}
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

        {createPortal(
          <DragOverlay adjustScale={false} dropAnimation={null}>
            {activeTask ? (
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
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}

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
    </DndContext>
  );
}

export default TaskPage;
