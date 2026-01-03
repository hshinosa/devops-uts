import { executeQuery } from '../../lib/db';

/**
 * API Endpoint: /api/stats
 * Returns task statistics and aggregated data for dashboard analytics
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Get total tasks count
    const [totalResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM tasks'
    );
    const totalTasks = totalResult?.count || 0;

    // 2. Get tasks grouped by priority
    const priorityData = await executeQuery(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM tasks
      GROUP BY priority
      ORDER BY 
        CASE priority
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END
    `);

    // 3. Get tasks grouped by status
    const statusData = await executeQuery(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      GROUP BY status
      ORDER BY
        CASE status
          WHEN 'pending' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'completed' THEN 3
        END
    `);

    // 4. Calculate completion rate
    const [completionResult] = await executeQuery(`
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total
      FROM tasks
    `);
    
    const completionRate = completionResult?.total > 0
      ? Math.round((completionResult.completed / completionResult.total) * 100)
      : 0;

    // 5. Get tasks due today
    const [dueTodayResult] = await executeQuery(`
      SELECT COUNT(*) as count
      FROM tasks
      WHERE DATE(due_date) = CURDATE()
      AND status != 'completed'
    `);
    const tasksDueToday = dueTodayResult?.count || 0;

    // 6. Get tasks overdue
    const [overdueResult] = await executeQuery(`
      SELECT COUNT(*) as count
      FROM tasks
      WHERE due_date < CURDATE()
      AND status != 'completed'
    `);
    const tasksOverdue = overdueResult?.count || 0;

    // 7. Get tasks by priority (individual counts for KPI cards)
    const priorityCounts = {
      high: 0,
      medium: 0,
      low: 0
    };
    priorityData.forEach(item => {
      priorityCounts[item.priority] = item.count;
    });

    // 8. Get tasks by status (individual counts for KPI cards)
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      completed: 0
    };
    statusData.forEach(item => {
      statusCounts[item.status] = item.count;
    });

    // 9. Format data for charts (Recharts format)
    const priorityChartData = priorityData.map(item => ({
      name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
      value: item.count,
      priority: item.priority
    }));

    const statusChartData = statusData.map(item => {
      // Format status name for display
      let displayName = item.status;
      if (item.status === 'in_progress') {
        displayName = 'In Progress';
      } else {
        displayName = item.status.charAt(0).toUpperCase() + item.status.slice(1);
      }
      
      return {
        name: displayName,
        value: item.count,
        status: item.status
      };
    });

    // Return comprehensive statistics
    const stats = {
      // Summary metrics
      summary: {
        totalTasks,
        completedTasks: statusCounts.completed,
        pendingTasks: statusCounts.pending,
        inProgressTasks: statusCounts.in_progress,
        completionRate,
        tasksDueToday,
        tasksOverdue
      },
      
      // Priority breakdown
      priority: {
        high: priorityCounts.high,
        medium: priorityCounts.medium,
        low: priorityCounts.low
      },
      
      // Status breakdown
      status: {
        pending: statusCounts.pending,
        inProgress: statusCounts.in_progress,
        completed: statusCounts.completed
      },
      
      // Chart data (formatted for Recharts)
      charts: {
        priority: priorityChartData,
        status: statusChartData
      },
      
      // Metadata
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
}
