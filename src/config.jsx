import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {

      baseURL: import.meta.env.VITE_API_BASE_URL
    //  baseURL: 'http://192.168.1.21:5002/api/v1'

  // baseURL: 'http://192.168.1.4:5002/api/v1'
};

export default config;
