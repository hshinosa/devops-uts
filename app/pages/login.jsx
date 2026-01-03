import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result.error) {
        setError('Invalid username or password');
        setLoading(false);
      } else {
        // Redirect to dashboard
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      
      <motion.div 
        className={styles.loginCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={styles.logo}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          🔐
        </motion.div>

        <h1 className={styles.title}>Mission Control</h1>
        <p className={styles.subtitle}>Access Authentication Required</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <motion.div 
              className={styles.error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className={styles.spinner}></span>
            ) : (
              'AUTHENTICATE'
            )}
          </motion.button>
        </form>

        <div className={styles.demoCredentials}>
          <p>🔑 Demo Credentials:</p>
          <code>Username: admin | Password: admin123</code>
        </div>
      </motion.div>
    </div>
  );
}
