import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const predictByImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/predict-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const predictByText = async (symptoms) => {
  const response = await api.post('/predict-text', { symptoms });
  return response.data;
};

export const getFoodsByNutrient = async (nutrientKey) => {
  const response = await api.get(`/foods/${nutrientKey}`);
  return response.data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export default api;
