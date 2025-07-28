// Array list activity, task, alarm dengan nama, label, foreground, background, dan iconpath
import task from '/assets/home/categories/task.svg';
import activity from '/assets/home/categories/activity.svg';
import alarm from '/assets/home/categories/alarm.svg';

export const activityTaskAlarm = [
  {
    name: "task",
    label: "Tugas",
    foreground: "#5263F3",
    background: "#DFEAFF",
    iconPath: task
  },
  {
    name: "activity",
    label: "Aktivitas",
    foreground: "#5263F3", 
    background: "#DFEAFF",
    iconPath: activity
  },
  {
    name: "alarm",
    label: "Alarm",
    foreground: "#5263F3",
    background: "#DFEAFF",
    iconPath: alarm
  }
];

// Fungsi helper untuk mendapatkan item berdasarkan nama
export const getItemByName = (name) => {
  return activityTaskAlarm.find(item => item.name.toLowerCase() === name.toLowerCase());
};

// Fungsi helper untuk mendapatkan item berdasarkan label
export const getItemByLabel = (label) => {
  return activityTaskAlarm.find(item => item.label.toLowerCase() === label.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua nama
export const getItemNames = () => {
  return activityTaskAlarm.map(item => item.name);
};

// Fungsi helper untuk mendapatkan semua label
export const getItemLabels = () => {
  return activityTaskAlarm.map(item => item.label);
};

// Fungsi helper untuk mendapatkan item dengan warna random
export const getRandomItem = () => {
  const randomIndex = Math.floor(Math.random() * activityTaskAlarm.length);
  return activityTaskAlarm[randomIndex];
};
