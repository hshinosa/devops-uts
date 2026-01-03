import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from '../styles/Analytics.module.css';

/**
 * KPI Cards Component
 * Displays key performance indicators for tasks with trend indicators
 */
export default function StatsCards({ stats, days = 7 }) {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetchTrends();
  }, [days]);

  const fetchTrends = async () => {
    try {
      const response = await fetch(`/api/stats/trends?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setTrends(data.trends);
      }
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  };

  if (!stats) return null;

  const getTrendIcon = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  const getTrendColor = (change) => {
    if (change > 0) return styles.trendUp;
    if (change < 0) return styles.trendDown;
    return styles.trendNeutral;
  };

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.summary.totalTasks,
      icon: '📋',
      color: 'cyan',
      trend: trends?.total
    },
    {
      title: 'Completed',
      value: stats.summary.completedTasks,
      icon: '✅',
      color: 'green',
      percentage: `${stats.summary.completionRate}%`,
      trend: trends?.completed
    },
    {
      title: 'In Progress',
      value: stats.summary.inProgressTasks,
      icon: '⚡',
      color: 'violet',
      trend: trends?.inProgress
    },
    {
      title: 'Pending',
      value: stats.summary.pendingTasks,
      icon: '⏳',
      color: 'orange',
      trend: trends?.pending
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
            {card.trend && (
              <div className={`${styles.statTrend} ${getTrendColor(card.trend.change)}`}>
                <span className={styles.trendIcon}>{getTrendIcon(card.trend.change)}</span>
                <span className={styles.trendValue}>{Math.abs(card.trend.change)}%</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}