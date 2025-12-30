// Custom hook untuk task operations
// Dapat digunakan independent oleh siapa saja tanpa tergantung component lain

import { useState, useCallback } from 'react';
import axios from 'axios';

export function useTasks(initialFilter = 'all') {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  // Fetch tasks dengan filter
  const fetchTasks = useCallback(async (customFilter = filter, customSearch = search) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (customFilter !== 'all') params.status = customFilter;
      if (customSearch) params.search = customSearch;

      const response = await axios.get('/api/tasks', { params });
      setTasks(response.data || []);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch tasks';
      setError(errorMsg);
      console.error('Error fetching tasks:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  // Create new task
  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);
      const response = await axios.post('/api/tasks', taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create task';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}`, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update task';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete task';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Apply filter
  const applyFilter = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // Apply search
  const applySearch = useCallback((query) => {
    setSearch(query);
  }, []);

  // Get statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  };

  return {
    tasks,
    loading,
    error,
    filter,
    search,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    applyFilter,
    applySearch,
  };
}
