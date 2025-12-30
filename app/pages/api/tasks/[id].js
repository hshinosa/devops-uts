import { executeQuery } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const task = await executeQuery('SELECT * FROM tasks WHERE id = ?', [id]);
      
      if (task.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(200).json(task[0]);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, priority, status, categoryId, dueDate, tags } = req.body;
      
      // Check if task exists
      const task = await executeQuery('SELECT * FROM tasks WHERE id = ?', [id]);
      if (task.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      const query = `
        UPDATE tasks 
        SET title = ?, description = ?, priority = ?, status = ?, category_id = ?, due_date = ?, tags = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      const params = [
        title || task[0].title,
        description !== undefined ? description : task[0].description,
        priority || task[0].priority,
        status || task[0].status,
        categoryId !== undefined ? categoryId : task[0].category_id,
        dueDate !== undefined ? dueDate : task[0].due_date,
        tags !== undefined ? tags : task[0].tags,
        id
      ];
      
      await executeQuery(query, params);
      
      // Log activity
      await executeQuery(
        'INSERT INTO activity_log (task_id, action, details, created_at) VALUES (?, ?, ?, NOW())',
        [id, 'UPDATE', `Updated task: ${Object.keys(req.body).join(', ')}`]
      );
      
      res.status(200).json({ id, ...req.body });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if task exists
      const task = await executeQuery('SELECT * FROM tasks WHERE id = ?', [id]);
      if (task.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // Log activity before deletion
      await executeQuery(
        'INSERT INTO activity_log (task_id, action, details, created_at) VALUES (?, ?, ?, NOW())',
        [id, 'DELETE', 'Task deleted']
      );
      
      await executeQuery('DELETE FROM tasks WHERE id = ?', [id]);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
