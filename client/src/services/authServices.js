import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_SERVER_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function signupService (userPayload){
  try {
    const response = await api.post('/account/signup', {userPayload});
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export async function LoginService(username, password){
    const response = await api.post('/api/Accounts/login', {username, password});
    return response.data;
}

export default api;