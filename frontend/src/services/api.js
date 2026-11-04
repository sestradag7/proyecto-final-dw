import axios from 'axios';

const API_URL = 'https://proyecto-final-dw-ie4h.onrender.com/api';

export const api = axios.create({ baseURL: API_URL });

export const crearEstudiante = (data) => api.post('/estudiantes', data);
export const getEstudiantes = () => api.get('/estudiantes');
export const guardarProgreso = (data) => api.post('/progreso', data);
export const getProgresos = (estudiante_id = '') => 
  api.get(`/progreso${estudiante_id ? `?estudiante_id=${estudiante_id}` : ''}`);