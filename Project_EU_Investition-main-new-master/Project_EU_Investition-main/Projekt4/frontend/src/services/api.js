import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchProjects = async (token) => {
  return axios.get(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerUser = async (username, password) => {
  return axios.post(`${API_URL}/auth/register`, { username, password });
};

export const loginUser = async (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};
