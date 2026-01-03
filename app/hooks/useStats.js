import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch and manage task statistics
 * Auto-refreshes every 30 seconds
 */
export default function useStats(refreshInterval = 30000) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Setup auto-refresh interval
    const interval = setInterval(fetchStats, refreshInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { stats, loading, error, refetch: fetchStats };
}
