import { executeQuery } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { status, category, priority, search } = req.query;
      
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const params = [];
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (category) {
        query += ' AND category_id = ?';
        params.push(category);
      }
      if (priority) {
        query += ' AND priority = ?';
        params.push(priority);
      }
      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const tasks = await executeQuery(query, params);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, priority, categoryId, dueDate, tags } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const query = `
        INSERT INTO tasks (title, description, priority, category_id, due_date, tags, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const params = [
        title,
        description || null,
        priority || 'medium',
        categoryId || null,
        dueDate || null,
        tags || null
      ];
      
      const result = await executeQuery(query, params);
      
      // Log activity
      await executeQuery(
        'INSERT INTO activity_log (task_id, action, details, created_at) VALUES (?, ?, ?, NOW())',
        [result.insertId, 'CREATE', 'Task created']
      );
      
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
