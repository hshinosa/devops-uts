'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/DashboardView.module.css';
import { useTasks } from '../hooks/useTasks';
import { useTaskStats } from '../hooks/useTaskStats';

export default function DashboardView() {
  const { stats: statsData, loading: statsLoading } = useTaskStats();
  const {
    tasks,
    loading: tasksLoading,
    createTask,
    updateTask,
    deleteTask,
    applyFilter,
    applySearch,
  } = useTasks();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });

  const stats = {
    total: statsData?.total || 0,
    completed: statsData?.completed || 0,
    pending: statsData?.pending || 0,
    inProgress: statsData?.inProgress || 0,
    highPriority: statsData?.highPriority || 0,
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    applyFilter(status === 'all' ? null : status);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applySearch(query);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      await createTask({
        ...formData,
        status: 'pending',
        category_id: 1,
      });
      setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowCreateForm(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await updateTask(taskId, { ...task, status: newStatus });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'done';
      case 'in_progress':
        return 'inProgress';
      default:
        return 'pending';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getStatusLabel = (status) => {
    return status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      className={styles.dashboardContainer}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={styles.contentWrapper}>
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Tasks</h1>
            <p className={styles.subtitle}>Manage and track your work efficiently</p>
          </div>
          <motion.button
            className={styles.createButton}
            onClick={() => setShowCreateForm(!showCreateForm)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New task
          </motion.button>
        </motion.div>

        {/* Statistics Grid */}
        {!statsLoading && (
          <motion.div className={styles.statsGrid} variants={itemVariants}>
            <motion.div className={styles.statCard} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className={styles.statLabel}>Total Tasks</div>
              <div className={styles.statValue}>{stats.total}</div>
            </motion.div>

            <motion.div className={styles.statCard} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className={styles.statLabel}>Completed</div>
              <div className={styles.statValue}>{stats.completed}</div>
            </motion.div>

            <motion.div className={styles.statCard} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className={styles.statLabel}>Pending</div>
              <div className={styles.statValue}>{stats.pending}</div>
            </motion.div>

            <motion.div className={styles.statCard} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className={styles.statLabel}>In Progress</div>
              <div className={styles.statValue}>{stats.inProgress}</div>
            </motion.div>

            <motion.div className={styles.statCard} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <div className={styles.statLabel}>High Priority</div>
              <div className={styles.statValue}>{stats.highPriority}</div>
            </motion.div>
          </motion.div>
        )}

        {/* Create Task Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              className={styles.createSection}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form className={styles.createForm} onSubmit={handleCreateTask}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Task Title</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter task title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Priority</label>
                    <select
                      className={styles.formSelect}
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Due Date</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Add task description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <motion.button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowCreateForm(false)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className={styles.submitButton}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Create task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Section */}
        <motion.div className={styles.controlsSection} variants={itemVariants}>
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.filtersContainer}>
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <motion.button
                key={status}
                className={`${styles.filterButton} ${filterStatus === status ? styles.active : ''}`}
                onClick={() => handleFilterChange(status)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'pending'
                  ? 'Pending'
                  : status === 'in_progress'
                  ? 'In Progress'
                  : 'Completed'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tasks Section */}
        {tasksLoading ? (
          <motion.div className={styles.loadingContainer} variants={itemVariants}>
            <div className={styles.loadingSpinner} />
            <span>Loading tasks...</span>
          </motion.div>
        ) : tasks.length === 0 ? (
          <motion.div className={styles.emptyState} variants={itemVariants}>
            <div className={styles.emptyStateIcon}>📋</div>
            <p className={styles.emptyStateText}>No tasks yet. Create one to get started.</p>
          </motion.div>
        ) : (
          <motion.div className={styles.tasksSection} variants={itemVariants}>
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={styles.taskCard}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className={styles.taskContent}>
                    <div className={styles.taskHeader}>
                      <h3 className={`${styles.taskTitle} ${task.status === 'completed' ? styles.completed : ''}`}>
                        {task.title}
                      </h3>
                    </div>

                    {task.description && <p style={{ margin: '8px 0', color: '#8b949e', fontSize: '14px' }}>{task.description}</p>}

                    <div className={styles.taskMeta}>
                      {task.due_date && (
                        <span style={{ color: '#8b949e', fontSize: '12px' }}>
                          Due: {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.taskActions}>
                    <select
                      className={styles.actionButton}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <motion.button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteTask(task.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
