import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from '../styles/Analytics.module.css';

/**
 * Priority Chart Component
 * Displays task distribution by priority (High, Medium, Low)
 */
export default function PriorityChart({ stats }) {
  if (!stats || !stats.charts.priority.length) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Tasks by Priority</h3>
        <div className={styles.noData}>No data available</div>
      </div>
    );
  }

  const COLORS = {
    high: '#ff0055',    // Danger red
    medium: '#ffaa00',  // Orange
    low: '#00ff9d'      // Success green
  };

  const chartData = stats.charts.priority.map(item => ({
    ...item,
    fill: COLORS[item.priority]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      className={styles.chartContainer}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className={styles.chartTitle}>
        <span className={styles.chartIcon}>🎯</span>
        Tasks by Priority
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
