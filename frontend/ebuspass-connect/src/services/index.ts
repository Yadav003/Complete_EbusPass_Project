// export { default as apiClient } from "./apiClient";
// export { ApiError, tokenStorage } from "./apiClient";

export { BASE_URL, ENDPOINTS } from "./endpoints";

export { authService } from "./auth.service";
export type { AuthUser, LoginPayload, RegisterPayload, AuthResponse } from "./auth.service";

export { applicationService } from "./application.service";
export type { Application, ApplicationStatus, CreateApplicationPayload } from "./application.service";

export { adminService } from "./admin.service";
export type { DashboardStats } from "./admin.service";

export { collegeService, routeService } from "./resources.service";
export type { College, Route } from "./resources.service";
