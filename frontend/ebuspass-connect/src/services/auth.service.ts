import { ENDPOINTS } from "./endpoints";

export interface RegisterPayload {
  fullname: string;
  email: string;
  mobile: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  mobile: string;
  role: "student" | "admin";
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Token Storage 

const ACCESS_TOKEN_KEY = "ebuspass_access_token";
const REFRESH_TOKEN_KEY = "ebuspass_refresh_token";

export const tokenStorage = {
  getAccessToken: () => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => sessionStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => sessionStorage.setItem(REFRESH_TOKEN_KEY, token),
  clear: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem("ebuspass_user");
  },
};

//  JWT helper — decode expiry without a library 
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds; Date.now() is in ms — subtract 30s buffer
    return Date.now() >= (payload.exp - 30) * 1000;
  } catch {
    return true;
  }
};

// API calls 

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data.user;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data as AuthResponse;
  },

  adminLogin: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await fetch(ENDPOINTS.AUTH.ADMIN_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Admin login failed");
    return data as AuthResponse;
  },

  logout: async (): Promise<void> => {
    const token = tokenStorage.getAccessToken();
    await fetch(ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  },

  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = tokenStorage.getRefreshToken();
    const response = await fetch(ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Token refresh failed");
    return data;
  },
};
