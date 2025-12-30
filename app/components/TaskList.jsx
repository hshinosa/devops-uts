import { motion } from 'framer-motion';
import styles from '../styles/TaskList.module.css';
import { useState } from 'react';

export default function TaskList({ tasks, onTaskDeleted, onTaskUpdated }) {
  const [updating, setUpdating] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdating(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      onTaskDeleted(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      className={styles.taskList}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          className={styles.taskCard}
          variants={itemVariants}
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.taskHeader}>
            <h4>{task.title}</h4>
            <div className={styles.badges}>
              <motion.span
                className={styles.priority}
                style={{ backgroundColor: getPriorityColor(task.priority) }}
                whileHover={{ scale: 1.1 }}
              >
                {task.priority}
              </motion.span>
              <motion.span
                className={styles.status}
                style={{ backgroundColor: getStatusColor(task.status) }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {task.status}
              </motion.span>
            </div>
          </div>

          {task.description && (
            <motion.p
              className={styles.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {task.description}
            </motion.p>
          )}

          {task.tags && (
            <motion.div
              className={styles.tags}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {task.tags.split(',').map((tag, idx) => (
                <motion.span
                  key={idx}
                  className={styles.tag}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  #{tag.trim()}
                </motion.span>
              ))}
            </motion.div>
          )}

          {task.due_date && (
            <motion.p
              className={styles.dueDate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              📅 Due: {new Date(task.due_date).toLocaleString()}
            </motion.p>
          )}

          <div className={styles.actions}>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              disabled={updating === task.id}
              className={styles.statusSelect}
            />

            <motion.button
              onClick={() => handleDelete(task.id)}
              className={styles.deleteButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Delete
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
