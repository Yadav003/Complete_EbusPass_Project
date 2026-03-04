// import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import type { AuthUser } from "./auth.service";

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export const adminService = {
 
};
