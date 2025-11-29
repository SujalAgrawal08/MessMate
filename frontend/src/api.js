import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This uses the proxy we set up
});

export const getMenu = () => api.get('/menu');
export const addMenuItem = (item) => api.post('/menu', item);

export const getFeedback = () => api.get('/feedback');
export const submitFeedback = (feedback) => api.post('/feedback', feedback);

export const getChart = () => api.get('/feedback/chart');
export const getFullMenuSchedule = () => api.get('/menu/full-schedule');
export const getTodaysMenu = () => api.get('/menu/today');