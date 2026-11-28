
import axios from "axios";
import { API_BASE_URL } from "../config";
import { setupAuthInterceptors } from "./authInterceptors";

const mentorApi = axios.create({
  baseURL: API_BASE_URL,
});

setupAuthInterceptors({
  api:mentorApi,
  accessTokenKey:'mentor_access_token',
  refreshTokenKey:'mentor_refresh_token',
  userKey:'mentor',
  role:'mentor'
})

export default mentorApi;
