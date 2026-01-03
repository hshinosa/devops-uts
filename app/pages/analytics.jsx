import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import useStats from '../hooks/useStats';
import StatsCards from '../components/StatsCards';
import PriorityChart from '../components/PriorityChart';
import StatusChart from '../components/StatusChart';
import styles from '../styles/Analytics.module.css';
import dashboardStyles from '../styles/DashboardView.module.css';

export default function Analytics() {
  const router = useRouter();
  const { stats, loading, error, refetch } = useStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className={dashboardStyles.dashboardContainer}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={dashboardStyles.contentWrapper}>
        {/* Header */}
        <motion.div className={dashboardStyles.header} variants={itemVariants}>
          <div className={dashboardStyles.headerContent}>
            <h1 className={dashboardStyles.title}>Analytics Dashboard</h1>
            <p className={dashboardStyles.subtitle}>Track your task performance and insights</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              className={styles.refreshButton}
              onClick={refetch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </motion.button>
            <motion.button
              className={dashboardStyles.createButton}
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Tasks
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div className={styles.loading} variants={itemVariants}>
            <div className={styles.loadingSpinner} />
            <p>Loading analytics...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div className={styles.error} variants={itemVariants}>
            <p>Failed to load analytics: {error}</p>
            <button onClick={refetch} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </motion.div>
        )}

        {/* Analytics Content */}
        {!loading && !error && stats && (
          <>
            {/* KPI Cards */}
            <motion.div variants={itemVariants}>
              <StatsCards stats={stats} />
            </motion.div>

            {/* Charts Grid */}
            <motion.div className={styles.chartsGrid} variants={itemVariants}>
              <PriorityChart stats={stats} />
              <StatusChart stats={stats} />
            </motion.div>

            {/* Additional Stats Info */}
            <motion.div className={styles.chartContainer} variants={itemVariants}>
              <h3 className={styles.chartTitle}>
                <span className={styles.chartIcon}>📈</span>
                Quick Insights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                    Completion Rate
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #00f0ff, #7000ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {stats.summary.completionRate}%
                  </div>
                </div>
                
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                    Tasks Due Today
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00f0ff' }}>
                    {stats.summary.tasksDueToday}
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                    Overdue Tasks
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff0055' }}>
                    {stats.summary.tasksOverdue}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div 
              variants={itemVariants}
              style={{ 
                textAlign: 'center', 
                color: 'rgba(255,255,255,0.4)', 
                fontSize: '0.875rem', 
                marginTop: '2rem',
                padding: '1rem'
              }}
            >
              Last updated: {new Date(stats.timestamp).toLocaleString()}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
