// Constants yang dapat digunakan independent oleh features manapun

export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_ORDER = {
  [TASK_PRIORITIES.HIGH]: 1,
  [TASK_PRIORITIES.MEDIUM]: 2,
  [TASK_PRIORITIES.LOW]: 3,
};

export const STATUS_LABELS = {
  [TASK_STATUSES.PENDING]: 'Pending',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.COMPLETED]: 'Completed',
};

export const PRIORITY_LABELS = {
  [TASK_PRIORITIES.HIGH]: 'High',
  [TASK_PRIORITIES.MEDIUM]: 'Medium',
  [TASK_PRIORITIES.LOW]: 'Low',
};

export const TASK_API_ENDPOINTS = {
  LIST: '/api/tasks',
  GET_ONE: (id) => `/api/tasks/${id}`,
  CREATE: '/api/tasks',
  UPDATE: (id) => `/api/tasks/${id}`,
  DELETE: (id) => `/api/tasks/${id}`,
};

// Helper functions untuk filtering dan sorting
export function filterTasksByStatus(tasks, status) {
  if (status === 'all' || !status) return tasks;
  return tasks.filter(task => task.status === status);
}

export function filterTasksByPriority(tasks, priority) {
  if (!priority) return tasks;
  return tasks.filter(task => task.priority === priority);
}

export function searchTasks(tasks, query) {
  if (!query) return tasks;
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title?.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery) ||
    task.tags?.toLowerCase().includes(lowerQuery)
  );
}

export function sortTasksByPriority(tasks) {
  return [...tasks].sort((a, b) => {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
}

export function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  });
}

export function groupTasksByStatus(tasks) {
  return {
    pending: tasks.filter(t => t.status === TASK_STATUSES.PENDING),
    inProgress: tasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS),
    completed: tasks.filter(t => t.status === TASK_STATUSES.COMPLETED),
  };
}

export function calculateTaskStats(tasks) {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TASK_STATUSES.COMPLETED).length,
    pending: tasks.filter(t => t.status === TASK_STATUSES.PENDING).length,
    inProgress: tasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS).length,
    highPriority: tasks.filter(t => t.priority === TASK_PRIORITIES.HIGH).length,
    completionRate: tasks.length > 0
      ? Math.round((tasks.filter(t => t.status === TASK_STATUSES.COMPLETED).length / tasks.length) * 100)
      : 0,
  };
}

export function isTaskOverdue(task) {
  if (!task.due_date) return false;
  return new Date(task.due_date) < new Date() && task.status !== TASK_STATUSES.COMPLETED;
}

export function formatTaskDate(dateString) {
  if (!dateString) return 'No deadline';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
