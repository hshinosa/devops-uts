// Independent API service
// Dapat digunakan oleh any component/hook tanpa dependency ke component lain

import axios from 'axios';
import { TASK_API_ENDPOINTS } from './taskUtils';

const apiClient = axios.create({
  baseURL: '/',
  timeout: 10000,
});

// Error handling
function handleApiError(error) {
  const message = error.response?.data?.error || error.message || 'An error occurred';
  console.error('API Error:', message);
  throw new Error(message);
}

// Task API operations
export const taskAPI = {
  // List all tasks dengan optional filtering
  async listTasks(filters = {}) {
    try {
      const response = await apiClient.get(TASK_API_ENDPOINTS.LIST, {
        params: filters,
      });
      return response.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get single task
  async getTask(taskId) {
    try {
      const response = await apiClient.get(TASK_API_ENDPOINTS.GET_ONE(taskId));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await apiClient.post(TASK_API_ENDPOINTS.CREATE, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update task
  async updateTask(taskId, updates) {
    try {
      const response = await apiClient.put(TASK_API_ENDPOINTS.UPDATE(taskId), updates);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const response = await apiClient.delete(TASK_API_ENDPOINTS.DELETE(taskId));
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Bulk operations
  async filterTasks(filters) {
    return this.listTasks(filters);
  },

  async searchTasks(query) {
    return this.listTasks({ search: query });
  },

  async getTasksByStatus(status) {
    return this.listTasks({ status });
  },

  async getTasksByPriority(priority) {
    return this.listTasks({ priority });
  },

  async getTasksByCategory(categoryId) {
    return this.listTasks({ category: categoryId });
  },
};

export default taskAPI;
