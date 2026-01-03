import { executeQuery } from '../../../lib/db';

/**
 * API Endpoint: /api/stats/timeseries
 * Returns tasks completion data for the last N days
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { days = 7 } = req.query;
    const daysCount = parseInt(days);

    // Get tasks completed per day for the last N days
    const completionData = await executeQuery(`
      SELECT 
        DATE(updated_at) as date,
        COUNT(*) as count
      FROM tasks
      WHERE status = 'completed'
        AND updated_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(updated_at)
      ORDER BY date ASC
    `, [daysCount]);

    // Get tasks created per day for the last N days
    const creationData = await executeQuery(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM tasks
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [daysCount]);

    // Fill in missing dates with zero counts
    const result = [];
    const today = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = completionData.find(d => {
        const dbDate = new Date(d.date);
        return dbDate.toISOString().split('T')[0] === dateStr;
      });
      
      const created = creationData.find(d => {
        const dbDate = new Date(d.date);
        return dbDate.toISOString().split('T')[0] === dateStr;
      });

      result.push({
        date: dateStr,
        completed: completed ? completed.count : 0,
        created: created ? created.count : 0,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    return res.status(200).json({
      days: daysCount,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching time-series data:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch time-series data',
      message: error.message 
    });
  }
}
