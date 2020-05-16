import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

instance.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = JSON.parse(localStorage.getItem('auth') ?? '{}').jwtToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  // Any 2xx
  response => response,
  // Any non-2xx
  error => {
    const data = error.response.data;
    const message = data.title; // TODO: for model validation errors, loop over "errors" property to display details

    toast.error(message);
    return Promise.reject({ ...error });
  }
);

export default instance;
