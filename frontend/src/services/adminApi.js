
import axios from "axios";
import { API_BASE_URL } from "../config";
import { setupAuthInterceptors } from "./authInterceptors";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

setupAuthInterceptors({
  adminApi,
  accessTokenKey:'admin_access_token',
  refreshTokenKey:'admin_refresh_token',
  userKey:'admin',
  role:'admin'
})

export default adminApi;
