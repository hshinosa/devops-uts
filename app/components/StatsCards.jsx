import { motion } from 'framer-motion';
import styles from '../styles/Analytics.module.css';

/**
 * KPI Cards Component
 * Displays key performance indicators for tasks
 */
export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.summary.totalTasks,
      icon: '📋',
      color: 'cyan',
      trend: null
    },
    {
      title: 'Completed',
      value: stats.summary.completedTasks,
      icon: '✅',
      color: 'green',
      percentage: `${stats.summary.completionRate}%`
    },
    {
      title: 'In Progress',
      value: stats.summary.inProgressTasks,
      icon: '⚡',
      color: 'violet',
      trend: null
    },
    {
      title: 'Pending',
      value: stats.summary.pendingTasks,
      icon: '⏳',
      color: 'orange',
      trend: null
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className={styles.statsGrid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className={`${styles.statCard} ${styles[card.color]}`}
          variants={cardVariants}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.statIcon}>{card.icon}</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>{card.title}</div>
            <div className={styles.statValue}>{card.value}</div>
            {card.percentage && (
              <div className={styles.statPercentage}>{card.percentage}</div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
