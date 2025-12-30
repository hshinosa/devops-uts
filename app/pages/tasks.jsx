import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import styles from '../styles/Tasks.module.css';

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const { tasks, loading, error, filter, search, fetchTasks, applyFilter, applySearch, deleteTask } = useTasks('all');

  return (
    <motion.div className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>📝 Task Management</h1>
        <motion.button
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? '❌ Cancel' : '➕ New Task'}
        </motion.button>
      </motion.header>

      {showForm && (
        <TaskForm onTaskCreated={() => { fetchTasks(); setShowForm(false); }} />
      )}

      <motion.div
        className={styles.filters}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => applySearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.filterButtons}>
          {['all', 'pending', 'in_progress', 'completed'].map(status => (
            <motion.button
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => applyFilter(status)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'all' ? '📋' : status === 'pending' ? '⏳' : status === 'in_progress' ? '⚙️' : '✅'}
              {' '}{status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          className={styles.loading}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading tasks...
        </motion.div>
      ) : (
        <TaskList tasks={tasks} onTaskDeleted={fetchTasks} onTasksChanged={fetchTasks} />
      )}
    </motion.div>
  );
}
