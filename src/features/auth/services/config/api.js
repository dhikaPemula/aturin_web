// config/api.js
const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://aturin-app.com/api/v1', timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

export default API_CONFIG;