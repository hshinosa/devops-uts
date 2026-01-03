import { motion } from 'framer-motion';
import styles from '../styles/Analytics.module.css';

/**
 * Export Button Component
 * Provides CSV export functionality for tasks
 */
export default function ExportButton() {
  const handleExport = async () => {
    try {
      // Fetch all tasks
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const tasks = await response.json();
      
      // Convert to CSV
      const csv = convertToCSV(tasks);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `tasks-export-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export tasks. Please try again.');
    }
  };

  const convertToCSV = (tasks) => {
    // Define CSV headers
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At', 'Updated At'];
    
    // Convert tasks to CSV rows
    const rows = tasks.map(task => [
      task.id,
      escapeCsv(task.title),
      escapeCsv(task.description),
      task.status,
      task.priority,
      task.dueDate || '',
      task.createdAt,
      task.updatedAt,
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  const escapeCsv = (value) => {
    if (!value) return '';
    
    // Convert to string and escape quotes
    const stringValue = String(value).replace(/"/g, '""');
    
    // Wrap in quotes if contains comma, newline, or quote
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue}"`;
    }
    
    return stringValue;
  };

  return (
    <motion.button
      className={styles.exportButton}
      onClick={handleExport}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={styles.exportIcon}>📥</span>
      Export to CSV
    </motion.button>
  );
}
