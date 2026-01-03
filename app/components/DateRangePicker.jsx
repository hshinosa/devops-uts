import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Analytics.module.css';

/**
 * Date Range Picker Component
 * Allows filtering analytics by custom date range
 */
export default function DateRangePicker({ onChange }) {
  const [range, setRange] = useState('7');

  const ranges = [
    { value: '7', label: 'Last 7 Days' },
    { value: '14', label: 'Last 14 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
  ];

  const handleChange = (newRange) => {
    setRange(newRange);
    if (onChange) {
      onChange(parseInt(newRange));
    }
  };

  return (
    <motion.div
      className={styles.dateRangePicker}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className={styles.dateRangeLabel}>
        <span className={styles.dateRangeIcon}>📅</span>
        Time Range:
      </label>
      <div className={styles.dateRangeButtons}>
        {ranges.map((r) => (
          <button
            key={r.value}
            className={`${styles.dateRangeButton} ${range === r.value ? styles.active : ''}`}
            onClick={() => handleChange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
