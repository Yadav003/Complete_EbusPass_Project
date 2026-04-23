import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface AdminUser {
  _id: string;
  fullname: string;
  email: string;
  mobile: string;
  role: "student" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface UsersSummary {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
}

export const adminService = {
  getAllUsers: async (): Promise<{ users: AdminUser[]; summary: UsersSummary }> => {
    const response = await apiClient.get<{ users: AdminUser[]; summary?: UsersSummary }>(ENDPOINTS.ADMIN.USERS);
    const users = response.data.users ?? [];

    return {
      users,
      summary: response.data.summary ?? {
        totalUsers: users.length,
        totalAdmins: users.filter((user) => user.role === "admin").length,
        totalStudents: users.filter((user) => user.role === "student").length,
      },
    };
  },

  updateUserRole: async (userId: string, role: "student" | "admin"): Promise<AdminUser> => {
    const response = await apiClient.patch<{ user: AdminUser }>(ENDPOINTS.ADMIN.UPDATE_USER_ROLE(userId), { role });
    return response.data.user;
  },
};
