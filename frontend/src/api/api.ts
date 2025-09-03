import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // make sure you store token after login
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`; // this is required by your controller
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
