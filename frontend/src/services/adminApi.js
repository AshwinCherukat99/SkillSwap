
import axios from "axios";
import { API_BASE_URL } from "../config";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("admin_access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;
