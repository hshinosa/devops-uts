import { motion } from 'framer-motion';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard({ stats }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const counterAnimation = {
    from: 0,
    to: 1,
  };

  return (
    <motion.div
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`${styles.card} ${styles.total}`}
        variants={cardVariants}
        whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      >
        <h3>Total Tasks</h3>
        <motion.p
          className={styles.number}
          variants={numberVariants}
          transition={{ delay: 0.3 }}
        >
          {stats.total}
        </motion.p>
      </motion.div>

      <motion.div
        className={`${styles.card} ${styles.completed}`}
        variants={cardVariants}
        whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      >
        <h3>Completed</h3>
        <motion.p
          className={styles.number}
          variants={numberVariants}
          transition={{ delay: 0.3 }}
        >
          {stats.completed}
        </motion.p>
        <motion.div
          className={styles.progressBar}
          animate={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </motion.div>

      <motion.div
        className={`${styles.card} ${styles.pending}`}
        variants={cardVariants}
        whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      >
        <h3>Pending</h3>
        <motion.p
          className={styles.number}
          variants={numberVariants}
          transition={{ delay: 0.3 }}
        >
          {stats.pending}
        </motion.p>
      </motion.div>

      <motion.div
        className={`${styles.card} ${styles.highPriority}`}
        variants={cardVariants}
        whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      >
        <h3>High Priority</h3>
        <motion.p
          className={styles.number}
          variants={numberVariants}
          transition={{ delay: 0.3 }}
          animate={{ scale: [1, 1.05, 1] }}
        >
          {stats.highPriority}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
