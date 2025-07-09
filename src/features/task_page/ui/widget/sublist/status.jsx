// Array list status dengan nama, label, icon, foreground, dan background
export const statuses = [
  {
    name: "belum_selesai",
    label: "Belum Selesai", 
    foreground: "#CC6D00",
    background: "#FFEDD9",
    iconPath: "/src/assets/home/clock.svg"
  },
  {
    name: "belum_dikerjakan",
    label: "Belum Dikerjakan", 
    foreground: "#CC6D00",
    background: "#FFEDD9",
    iconPath: "/src/assets/home/clock.svg"
  },
  {
    name: "selesai",
    label: "Selesai",
    foreground: "#3DA755",
    background: "#C5E9CD",
    iconPath: "/src/assets/home/check-circle.svg"
  },
  {
    name: "terlambat",
    label: "Terlambat",
    foreground: "#999999",
    background: "#E4E4E7",
    iconPath: "/src/assets/home/warning-circle.svg"
  },
];

// Fungsi helper untuk mendapatkan status berdasarkan nama
export const getStatusByName = (name) => {
  return statuses.find(status => status.name.toLowerCase() === name.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua nama status
export const getStatusNames = () => {
  return statuses.map(status => status.name);
};

// Fungsi helper untuk mendapatkan status dengan warna random
export const getRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Fungsi helper untuk mendapatkan status berdasarkan label
export const getStatusByLabel = (label) => {
  return statuses.find(status => status.label.toLowerCase() === label.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua label status
export const getStatusLabels = () => {
  return statuses.map(status => status.label);
};
