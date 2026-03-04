export const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";


const API_V1 = "/api/v1";

export const ENDPOINTS = {

  AUTH: {
    REGISTER: `${API_V1}/users/register`,
    LOGIN: `${API_V1}/users/login`,
    LOGOUT: `${API_V1}/users/logout`,
    REFRESH_TOKEN: `${API_V1}/users/refresh-token`,
  },

  
  ADMIN: {},

 APPLICATIONS: {},

  COLLEGES: {},

  ROUTES: {},

  UPLOADS: {},
} as const;
