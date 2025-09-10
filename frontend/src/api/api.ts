import axios from "axios";


const API = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); 
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
