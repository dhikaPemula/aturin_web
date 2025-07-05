import axios from "axios";

const BASE_URL = "https://aturin-app.com/api/v1/tasks";
// Inisialisasi token langsung di sini (hardcoded)
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F0dXJpbi1hcHAuY29tL2FwaS92MS9sb2dpbiIsImlhdCI6MTc1MDc1OTMyOCwibmJmIjoxNzUwNzU5MzI4LCJqdGkiOiJjTzBSWmFad1lPQWg0eDlIIiwic3ViIjoiOTciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Jdvo2d1RtnyeoQ0NxbzFp2IaxP-6eg5QYzYeXnmMF0g";

// Helper: get user ID from localStorage
function getUserId() {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
}

// CRUD Operations

// Create new task
export async function createTask({
  title,
  description,
  deadline,
  estimatedDuration,
  category,
  status = 'belum_selesai',
  alarmId,
  token = TOKEN
}) {
  const userId = getUserId();
  if (!userId) {
    throw new Error('User ID tidak ditemukan. Silakan login ulang.');
  }

  const res = await axios.post(BASE_URL, {
    user_id: userId,
    task_title: title,
    task_description: description,
    task_deadline: deadline,
    estimated_task_duration: estimatedDuration,
    task_category: category,
    task_status: status,
    alarm_id: alarmId,
  }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Update task
export async function updateTask(slug, {
  title,
  description,
  deadline,
  estimatedDuration,
  status,
  category,
  alarmId,
  token = TOKEN
}) {
  const updateData = {};
  if (title !== undefined) updateData.task_title = title;
  if (description !== undefined) updateData.task_description = description;
  if (deadline !== undefined) updateData.task_deadline = deadline;
  if (estimatedDuration !== undefined) updateData.estimated_task_duration = estimatedDuration;
  if (status !== undefined) updateData.task_status = status;
  if (category !== undefined) updateData.task_category = category;
  if (alarmId !== undefined) updateData.alarm_id = alarmId;

  console.log('API updateTask - slug:', slug);
  console.log('API updateTask - updateData:', updateData);
  console.log('API updateTask - token:', token ? 'Present' : 'Missing');

  const res = await axios.patch(`${BASE_URL}/${slug}`, updateData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Delete task
export async function deleteTask(slug, token = TOKEN) {
  const res = await axios.delete(`${BASE_URL}/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

// FETCH Operations

// Get all tasks
export async function getAllTasks(token = TOKEN) {
  try {
    const res = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      const tasks = Array.isArray(res.data.data) ? res.data.data : [];
      
      // TODO: Implementasi relasi alarm ketika alarm API service sudah siap
      // import { getAllAlarms } from './alarm_api_service';
      // const allAlarms = await getAllAlarms(token);
      // const alarmMap = Object.fromEntries(allAlarms.filter(a => a.id != null).map(a => [a.id, a]));
      // return tasks.map(task => {
      //   if (task.alarm_id && alarmMap[task.alarm_id]) {
      //     return { ...task, alarm: alarmMap[task.alarm_id] };
      //   }
      //   return task;
      // });
      
      return tasks;
    }
    return [];
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    throw error;
  }
}

// Get tasks for today
export async function getTasksToday(token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      const tasks = Array.isArray(res.data.data) ? res.data.data : [];
      
      // TODO: Implementasi relasi alarm ketika alarm API service sudah siap
      // import { getAllAlarms } from './alarm_api_service';
      // const allAlarms = await getAllAlarms(token);
      // const alarmMap = Object.fromEntries(allAlarms.filter(a => a.id != null).map(a => [a.id, a]));
      // return tasks.map(task => {
      //   if (task.alarm_id && alarmMap[task.alarm_id]) {
      //     return { ...task, alarm: alarmMap[task.alarm_id] };
      //   }
      //   return task;
      // });
      
      return tasks;
    }
    return [];
  } catch (error) {
    console.error('Error in getTasksToday:', error);
    throw error;
  }
}

// Get uncompleted tasks for today
export async function getUncompletedTasksToday(token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/uncompleted-today`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      const tasks = Array.isArray(res.data.data) ? res.data.data : [];
      
      // TODO: Implementasi relasi alarm ketika alarm API service sudah siap
      // import { getAllAlarms } from './alarm_api_service';
      // const allAlarms = await getAllAlarms(token);
      // const alarmMap = Object.fromEntries(allAlarms.filter(a => a.id != null).map(a => [a.id, a]));
      // return tasks.map(task => {
      //   if (task.alarm_id && alarmMap[task.alarm_id]) {
      //     return { ...task, alarm: alarmMap[task.alarm_id] };
      //   }
      //   return task;
      // });
      
      return tasks;
    }
    return [];
  } catch (error) {
    console.error('Error in getUncompletedTasksToday:', error);
    throw error;
  }
}

// Get task by slug
export async function getTaskBySlug(slug, token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error in getTaskBySlug:', error);
    throw error;
  }
}

// Get dashboard summary
export async function getDashboardSummary(token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error in getDashboardSummary:', error);
    throw error;
  }
}

// Count late tasks
export async function countLateTasks(token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/late-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error in countLateTasks:', error);
    throw error;
  }
}

// Get tasks by status
export async function getTasksByStatus(status, token = TOKEN) {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/by-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      params: { status },
    });

    if (res.data && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error in getTasksByStatus:', error);
    throw error;
  }
}
