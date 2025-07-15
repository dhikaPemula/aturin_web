import React, { useState, useEffect } from "react";
import { DragDropContext } from '@hello-pangea/dnd';
import styles from "./task_page.module.css";
import useTaskList from "../../../../core/hooks/useTaskList.js";
import AddSection from "../widget/addbutton/addbutton.jsx";
import Search from "../widget/search/search.jsx";
import StatusFilter from "../widget/statusfilter/statusfilter.jsx";
import CategoryFilter from "../widget/categoryfilter/categoryfilter.jsx";
import AddEditForm from "../../../crudtask/screen/addeditform.jsx";
import Toast from "../../../../core/widgets/toast/toast.jsx";
import List from "../widget/list/list.jsx";
import UpperSection from "../widget/uppersection/uppersection.jsx";

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
  const [taskList, setTaskList] = useState([]);

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

  useEffect(() => {
    setTaskList(tasks || []);
  }, [tasks]);

  // Filtering logic
  const filteredTasks = taskList.filter(task => {
    let match = true;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      match = match && (
        (task.task_title || "").toLowerCase().includes(q) ||
        (task.task_description || "").toLowerCase().includes(q) ||
        (task.task_category || "").toLowerCase().includes(q)
      );
    }
    if (categoryFilter && categoryFilter !== "") {
      match = match && (task.task_category || "").toLowerCase() === categoryFilter.toLowerCase();
    }
    if (statusFilter && statusFilter !== "") {
      match = match && (task.task_status === statusFilter);
    }
    return match;
  });

  // Group filteredTasks by status for List
  const tasksByStatus = {
    terlambat: [],
    belum_selesai: [],
    selesai: [],
  };
  filteredTasks.forEach(task => {
    if (tasksByStatus[task.task_status]) tasksByStatus[task.task_status].push(task);
  });

  const handleOnDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceCol = Array.from(tasksByStatus[source.droppableId]);
    const destCol = Array.from(tasksByStatus[destination.droppableId]);
    const [removed] = sourceCol.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, removed);
      setTaskList(prev => {
        const other = prev.filter(t => t.task_status !== source.droppableId);
        return [...other, ...sourceCol];
      });
    } else {
      // Update status locally
      removed.task_status = destination.droppableId;
      destCol.splice(destination.index, 0, removed);
      setTaskList(prev => {
        const other = prev.filter(t => t.task_status !== source.droppableId && t.task_status !== destination.droppableId);
        return [...other, ...sourceCol, ...destCol];
      });
      // Persist status change to backend
      try {
        const result = await updateTask(removed.slug, { status: destination.droppableId });
        if (result && result.success !== false) {
          displayToast({
            title: 'Berhasil',
            message: 'Status tugas berhasil diperbarui',
          });
        } else {
          throw new Error(result?.error || 'Gagal memperbarui status tugas');
        }
      } catch (error) {
        displayToast({
          title: 'Gagal',
          message: error.message || 'Gagal memperbarui status tugas',
        });
        // Optionally: revert local state if needed
        // refreshTasks();
      }
    }
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
  const displayToast = (config) => {
    setToastConfig(config);
    setShowToastNotification(true);
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
            <Search onSearchChange={handleSearchChange} placeholder="Cari tugas..." />
          </div>
          <div className={styles.filterSection}>
            <StatusFilter onStatusChange={handleStatusChange} placeholder="Semua status" />
          </div>
          <div className={styles.categorySection}>
            <CategoryFilter onCategoryChange={handleCategoryChange} placeholder="Semua kategori" />
          </div>
        </div>
        <DragDropContext
          onDragEnd={handleOnDragEnd}
        >
          <div
            className={styles.listSection}
            style={{
              display: 'flex',
              gap: 32,
              minHeight: 500,
              alignItems: 'flex-start',
              paddingBottom: 16,
              width: '100%',
              maxWidth: '100vw',
            }}
          >
            <List
              tasks={filteredTasks}
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
        </DragDropContext>
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
