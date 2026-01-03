import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from '../styles/Analytics.module.css';

/**
 * Status Chart Component
 * Displays task distribution by status (Pending, In Progress, Completed)
 */
export default function StatusChart({ stats }) {
  if (!stats || !stats.charts.status.length) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Tasks by Status</h3>
        <div className={styles.noData}>No data available</div>
      </div>
    );
  }

  const COLORS = {
    pending: '#7000ff',     // Violet
    in_progress: '#00f0ff', // Cyan
    completed: '#00ff9d'    // Green
  };

  const chartData = stats.charts.status.map(item => ({
    ...item,
    fill: COLORS[item.status]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.name}</p>
          <p className={styles.tooltipValue}>{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
        <span className={styles.chartIcon}>📊</span>
        Tasks by Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
