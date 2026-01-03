import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from '../styles/Analytics.module.css';

/**
 * Time Series Chart Component
 * Displays tasks completed and created over time
 */
export default function TimeSeriesChart({ days = 7 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stats/timeseries?days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time-series data');
      }
      
      const result = await response.json();
      setData(result.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching time-series:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Task Trends</h3>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Task Trends</h3>
        <div className={styles.error}>Failed to load chart</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.label}</p>
          <p style={{ color: '#00ff9d', margin: '4px 0' }}>
            Completed: {payload[0].value}
          </p>
          <p style={{ color: '#00f0ff', margin: '4px 0' }}>
            Created: {payload[1].value}
          </p>
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
        <span className={styles.chartIcon}>📈</span>
        Task Trends (Last {days} Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />
          <XAxis 
            dataKey="label" 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#00ff9d" 
            strokeWidth={3}
            dot={{ fill: '#00ff9d', r: 4 }}
            activeDot={{ r: 6 }}
            name="Completed"
            animationDuration={800}
          />
          <Line 
            type="monotone" 
            dataKey="created" 
            stroke="#00f0ff" 
            strokeWidth={3}
            dot={{ fill: '#00f0ff', r: 4 }}
            activeDot={{ r: 6 }}
            name="Created"
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
