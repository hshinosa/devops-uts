import { executeQuery } from '../../../lib/db';

/**
 * API endpoint for getting trend data (comparing current vs previous period)
 * GET /api/stats/trends?days=7
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const days = parseInt(req.query.days) || 7;
    
    // Calculate date ranges
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - days);
    
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);
    
    // Current period stats
    const currentQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM tasks
      WHERE created_at >= ?
    `;
    
    const currentResults = await executeQuery(currentQuery, [currentStart.toISOString().split('T')[0]]);
    const current = currentResults[0];
    
    // Previous period stats
    const previousQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM tasks
      WHERE created_at >= ? AND created_at < ?
    `;
    
    const previousResults = await executeQuery(previousQuery, [
      previousStart.toISOString().split('T')[0],
      currentStart.toISOString().split('T')[0]
    ]);
    const previous = previousResults[0];
    
    // Calculate trends
    const calculateTrend = (currentValue, previousValue) => {
      if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
      }
      return Math.round(((currentValue - previousValue) / previousValue) * 100);
    };
    
    const trends = {
      total: {
        current: current.total,
        previous: previous.total,
        change: calculateTrend(current.total, previous.total)
      },
      completed: {
        current: current.completed,
        previous: previous.completed,
        change: calculateTrend(current.completed, previous.completed)
      },
      inProgress: {
        current: current.inProgress,
        previous: previous.inProgress,
        change: calculateTrend(current.inProgress, previous.inProgress)
      },
      pending: {
        current: current.pending,
        previous: previous.pending,
        change: calculateTrend(current.pending, previous.pending)
      }
    };
    
    res.status(200).json({
      days,
      trends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trends API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
