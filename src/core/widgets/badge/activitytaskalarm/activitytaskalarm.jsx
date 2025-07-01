// Array list activity, task, alarm dengan nama, label, foreground, background, dan iconpath
export const activityTaskAlarm = [
  {
    name: "task",
    label: "Tugas",
    foreground: "#5263F3",
    background: "#DFEAFF",
    iconPath: "/src/assets/home/categories/task.svg"
  },
  {
    name: "activity",
    label: "Aktivitas",
    foreground: "#5263F3", 
    background: "#DFEAFF",
    iconPath: "/src/assets/home/categories/activity.svg"
  },
  {
    name: "alarm",
    foreground: "#5263F3",
    background: "#DFEAFF",
    iconPath: "/src/assets/home/categories/alarm.svg"
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
