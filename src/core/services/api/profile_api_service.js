import axios from "axios";

const BASE_URL = "https://aturin-app.com/api/v1/profile";

// Helper: get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

export async function getProfile() {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Ambil data user dari struktur response yang sesuai
  if (res.data && res.data.data) {
    const userData = res.data.data;
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || '/src/assets/avatars/profile1.jpg',
      slug: userData.slug,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };
  }
  throw new Error('Data user tidak ditemukan di response');
}

export async function editProfile(data) {
  const token = getToken();
  const res = await axios.patch(`${BASE_URL}/edit`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getBannerProfile() {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/banner`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

export async function getGlobalAlarmStatus() {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/alarmGlobal`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

export async function switchGlobalAlarmStatus() {
  const token = getToken();
  const res = await axios.put(`${BASE_URL}/alarmGlobal`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}
