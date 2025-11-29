// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api', // This uses the proxy we set up
// });

// export const getMenu = () => api.get('/menu');
// export const addMenuItem = (item) => api.post('/menu', item);

// export const getFeedback = () => api.get('/feedback');
// export const submitFeedback = (feedback) => api.post('/feedback', feedback);

// export const getChart = () => api.get('/feedback/chart');
// export const getFullMenuSchedule = () => api.get('/menu/full-schedule');
// export const getTodaysMenu = () => api.get('/menu/today');

import axios from 'axios';

// Point directly to your FastAPI backend
const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// --- 1. INTERCEPTOR: Attaches Token to every request ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('messmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 2. AUTHENTICATION APIs ---
export const loginUser = async (email, password) => {
  // FastAPI expects form-data for login, not JSON
  const formData = new URLSearchParams();
  formData.append('username', email); // Map email to 'username'
  formData.append('password', password);
  formData.append('grant_type', 'password'); // Required by OAuth2 standard
  
  return api.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export const registerUser = (userData) => api.post('/register', userData);


// --- 3. WASTE MANAGEMENT APIs (For Admin) ---
export const logWaste = (wasteData) => api.post('/waste/', wasteData);
export const getWasteAnalytics = () => api.get('/waste/analytics');
export const markAttendance = (email, mealType) => 
  api.post(`/attendance/mark?student_email=${email}&meal_type=${mealType}`);

export const getTodayAttendanceCount = () => api.get('/attendance/today');

// --- EXISTING APIs (Menu & Feedback) ---
// We use the 'api' instance here so they also get the Token automatically
export const getMenu = () => api.get('/menu'); // If you have this endpoint
export const addMenuItem = (item) => api.post('/menu', item);

export const getFeedback = () => api.get('/feedback/'); // Added trailing slash
export const submitFeedback = (feedback) => api.post('/feedback/', feedback);

export const getChart = () => api.get('/feedback/chart');
export const getFullMenuSchedule = () => api.get('/menu/weekly');
export const getTodaysMenu = () => api.get('/menu/today');
export const getDemandForecast = () => api.get('/analytics/forecast/demand');
export const getWasteChart = () => api.get('/analytics/forecast/waste-chart');

export default api;