// Array list categories dengan nama, foreground, background, dan iconpath
import akademik from '/assets/home/categories/akademik.svg'
import hiburan from '/assets/home/categories/hiburan.svg'
import pekerjaan from '/assets/home/categories/pekerjaan.svg'
import olahraga from '/assets/home/categories/olahraga.svg'
import sosial from '/assets/home/categories/sosial.svg'
import spiritual from '/assets/home/categories/spiritual.svg'
import pribadi from '/assets/home/categories/pribadi.svg'
import istirahat from '/assets/home/categories/istirahat.svg'

export const categories = [
  {
    name: "akademik",
    label: "Akademik",
    foreground: "#3498DB",
    background: "#CCEBFF",
    iconPath: akademik
  },
  {
    name: "hiburan",
    label: "Hiburan",
    foreground: "#9B59B6", 
    background: "#F0DBFF",
    iconPath: hiburan
  },
  {
    name: "pekerjaan",
    label: "Pekerjaan",
    foreground: "#8E5C42",
    background: "#FFE2D3",
    iconPath: pekerjaan
  },
  {
    name: "olahraga",
    label: "Olahraga",
    foreground: "#E74C3C",
    background: "#FFD8D8",
    iconPath: olahraga
  },
  {
    name: "sosial",
    label: "Sosial",
    foreground: "#E67E22",
    background: "#FFE3CA",
    iconPath: sosial
  },
  {
    name: "spiritual",
    label: "Spiritual",
    foreground: "#27AE60",
    background: "#D3FFE5",
    iconPath: spiritual
  },
  {
    name: "pribadi",
    label: "Pribadi",
    foreground: "#F1C40F",
    background: "#FFF3C2",
    iconPath: pribadi
  },
  {
    name: "istirahat",
    label: "Istirahat",
    foreground: "#283593",
    background: "#D2D8FF",
    iconPath: istirahat
  },
];

// Fungsi helper untuk mendapatkan category berdasarkan nama
export const getCategoryByName = (name) => {
  return categories.find(category => category.name.toLowerCase() === name.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua nama category
export const getCategoryNames = () => {
  return categories.map(category => category.name);
};

// Fungsi helper untuk mendapatkan category dengan warna random
export const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

// Fungsi helper untuk mendapatkan category berdasarkan label
export const getCategoryByLabel = (label) => {
  return categories.find(category => category.label.toLowerCase() === label.toLowerCase());
};

// Fungsi helper untuk mendapatkan semua label category
export const getCategoryLabels = () => {
  return categories.map(category => category.label);
};
