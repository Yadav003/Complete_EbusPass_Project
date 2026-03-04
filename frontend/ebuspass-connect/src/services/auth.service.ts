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

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data.user;
  },
};
