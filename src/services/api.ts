import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7205/api', 
});

export default api;