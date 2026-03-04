export const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";


const API_V1 = "/api/v1";

export const ENDPOINTS = {

  AUTH: {
    REGISTER: `${API_V1}/users/register`,
   },

  
  ADMIN: {},

 APPLICATIONS: {},

  COLLEGES: {},

  ROUTES: {},

  UPLOADS: {},
} as const;
