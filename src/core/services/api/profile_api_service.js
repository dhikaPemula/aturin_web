import axios from "axios";

const BASE_URL = "https://aturin-app.com/api/v1/profile";
// Inisialisasi token langsung di sini (hardcoded)
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F0dXJpbi1hcHAuY29tL2FwaS92MS9sb2dpbiIsImlhdCI6MTc1MDc1OTMyOCwibmJmIjoxNzUwNzU5MzI4LCJqdGkiOiJjTzBSWmFad1lPQWg0eDlIIiwic3ViIjoiOTciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Jdvo2d1RtnyeoQ0NxbzFp2IaxP-6eg5QYzYeXnmMF0g";

export async function getProfile(token = TOKEN) {
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

export async function editProfile(data, token = TOKEN) {
  const res = await axios.patch(`${BASE_URL}/edit`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getBannerProfile(token = TOKEN) {
  const res = await axios.get(`${BASE_URL}/banner`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

export async function getGlobalAlarmStatus(token = TOKEN) {
  const res = await axios.get(`${BASE_URL}/alarmGlobal`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

export async function switchGlobalAlarmStatus(token = TOKEN) {
  const res = await axios.put(`${BASE_URL}/alarmGlobal`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}
