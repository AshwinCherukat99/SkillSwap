
import axios from "axios";
import { API_BASE_URL } from "../config";

const mentorApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

mentorApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("mentor_access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default mentorApi;
