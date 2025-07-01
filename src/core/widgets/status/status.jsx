// Array list status dengan nama, label, foreground, dan background
export const statuses = [
  {
    name: "selesai",
    label: "Selesai",
    foreground: "#3DA755",
    background: "#C5E9CD"
  },
  {
    name: "belum_dikerjakan",
    label: "Belum Dikerjakan", 
    foreground: "#CC6D00",
    background: "#FFEDD9"
  },
  {
    name: "terlambat",
    label: "Terlambat",
    foreground: "#999999",
    background: "#E4E4E7"
  },
  {
    name: "hari_ini",
    label: "Hari ini",
    foreground: "#0077CC",
    background: "#E6F4FF"
  },
  {
    name: "besok",
    label: "Besok",
    foreground: "#E89B00",
    background: "#FFE5B0"
  },
  {
    name: "lusa",
    label: "Lusa",
    foreground: "#E89B00",
    background: "#FFE5B0"
  }
];

// Fungsi helper untuk mendapatkan status berdasarkan nama
export const getStatusByName = (name) => {
  return statuses.find(status => status.name.toLowerCase() === name.toLowerCase());
};

// Fungsi helper untuk mendapatkan status berdasarkan label
export const getStatusByLabel = (label) => {
  return statuses.find(status => status.label.toLowerCase() === label.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua nama status
export const getStatusNames = () => {
  return statuses.map(status => status.name);
};

// Fungsi helper untuk mendapatkan semua label status
export const getStatusLabels = () => {
  return statuses.map(status => status.label);
};

// Fungsi helper untuk mendapatkan status dengan warna random
export const getRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};
