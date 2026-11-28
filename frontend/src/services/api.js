
import axios from "axios";
import { API_BASE_URL } from "../config";
import { setupAuthInterceptors } from "./authInterceptors";

const api = axios.create({
  baseURL: API_BASE_URL,
});

setupAuthInterceptors({
  api:api,
  accessTokenKey:'access_token',
  refreshTokenKey:'refresh_token',
  userKey:'user',
  role:'user'
})

export default api;
