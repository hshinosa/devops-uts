import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles/TaskForm.module.css';

export default function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        tags: '',
      });

      setTimeout(() => {
        setSuccess(false);
        onTaskCreated();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h3>Create New Task</h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: error ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && <div className={styles.error}>{error}</div>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: success ? 1 : 0, scale: success ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {success && (
          <div className={styles.success}>✅ Task created successfully!</div>
        )}
      </motion.div>

      <motion.div className={styles.formGroup} variants={fieldVariants}>
        <label>Title *</label>
        <motion.input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
          whileFocus={{ scale: 1.01 }}
        />
      </motion.div>

      <motion.div className={styles.formGroup} variants={fieldVariants}>
        <label>Description</label>
        <motion.textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="3"
          whileFocus={{ scale: 1.01 }}
        />
      </motion.div>

      <motion.div className={styles.row} variants={fieldVariants}>
        <div className={styles.formGroup}>
          <label>Priority</label>
          <motion.select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            whileFocus={{ scale: 1.01 }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </motion.select>
        </div>

        <div className={styles.formGroup}>
          <label>Due Date</label>
          <motion.input
            type="datetime-local"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            whileFocus={{ scale: 1.01 }}
          />
        </div>
      </motion.div>

      <motion.div className={styles.formGroup} variants={fieldVariants}>
        <label>Tags (comma-separated)</label>
        <motion.input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., work, urgent, important"
          whileFocus={{ scale: 1.01 }}
        />
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </motion.button>
    </motion.form>
  );
}
