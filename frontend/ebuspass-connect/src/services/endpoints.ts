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

  APPLICATIONS: {
    BASIC_DETAILS: `${API_V1}/applications/basic-details`,
    DOCUMENTS_UPLOAD: `${API_V1}/applications/documents-upload`,
    CREATE: `${API_V1}/applications/create`,
    USER_APPLICATIONS: `${API_V1}/applications/my-applications`,
    GET_ALL: `${API_V1}/applications`,
    GET_BY_ID: (id: string) => `${API_V1}/applications/${id}`,
    UPDATE: (id: string) => `${API_V1}/applications/${id}`,
    DELETE: (id: string) => `${API_V1}/applications/${id}`,
    UPDATE_STATUS: (id: string) => `${API_V1}/applications/${id}/status`,
  },

  COLLEGES: {},

  ROUTES: {},

  UPLOADS: {},
} as const;
