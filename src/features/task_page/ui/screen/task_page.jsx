import React, { useState, useMemo } from "react";
import styles from "./task_page.module.css";
import useTaskList from "../../../../core/hooks/useTaskList.js";
import Badge from "../../../../core/widgets/badge/buildbadge/badge.jsx";
import StatusBadge from "../../../../core/widgets/status/statusbadge.jsx";
import UpperSection from "../widget/uppersection/uppersection.jsx";
import AddSection from "../widget/addbutton/addbutton.jsx";
import Search from "../widget/search/search.jsx";
import StatusFilter from "../widget/statusfilter/statusfilter.jsx";
import CategoryFilter from "../widget/categoryfilter/categoryfilter.jsx";
import List from "../widget/list/list.jsx";
// Import icons
import clockIcon from "../../../../assets/home/clock.svg";
import jadwalIcon from "../../../../assets/home/jadwal.svg";
import checkCircleIcon from "../../../../assets/home/check-circle.svg";
import warningCircleIcon from "../../../../assets/home/warning-circle.svg";

function TaskPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  const handleEditTask = (task) => {
    console.log("Edit task:", task);
    // TODO: Implement edit task functionality
  };

  const handleDeleteTask = (task) => {
    console.log("Delete task:", task);
    // TODO: Implement delete task functionality
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.upperSection}>
          <div className={styles.tugas}>
            <UpperSection />
          </div>
          <div className={styles.addSection}>
            <AddSection />
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
            searchQuery={searchQuery}
            currentStatus={statusFilter}
            currentCategory={categoryFilter}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
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
