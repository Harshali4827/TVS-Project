import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //   baseURL: import.meta.env.VITE_API_BASE_URL,

  // baseURL: 'http://91.108.104.108:3003/api/v1'
  baseURL: 'http://192.168.1.19:5002/api/v1'
};

export default config;
