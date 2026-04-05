export const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";


const API_V1 = "/api/v1";

export const ENDPOINTS = {

  AUTH: {
    REGISTER: `${API_V1}/users/register`,
    LOGIN: `${API_V1}/users/login`,
    LOGOUT: `${API_V1}/users/logout`,
    REFRESH_TOKEN: `${API_V1}/users/refresh-token`,
    ADMIN_LOGIN: `${API_V1}/users/admin/login`,
  },

  
  ADMIN: {},

  APPLICATIONS: {
    BASIC_DETAILS: `${API_V1}/applications/basic-details`,
    DOCUMENTS_UPLOAD: `${API_V1}/applications/documents-upload`,
    ROUTE_SELECTION: `${API_V1}/applications/route-selection`,
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

  RESOURCES: {
    STATES: `${API_V1}/resources/locations/states`,
    DISTRICTS: (state: string) => `${API_V1}/resources/locations/districts?state=${encodeURIComponent(state)}`,
    BUS_STANDS: (state: string, district: string) =>
      `${API_V1}/resources/locations/bus-stands?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`,
  },

  UPLOADS: {},
} as const;
