import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_SERVER_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadService(clothesPayload){
  try {
    const response = await api.post('/clothes/uploadService', {clothesPayload});
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export async function getAllClothes(user){
    const response = await api.get('/api/clothes/getAllClothes', {user});

    return response.data;
}

export default api;