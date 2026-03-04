
// import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export interface Application {
  _id: string;
  userId: string;
  collegeId: string;
  routeId: string;
  status: ApplicationStatus;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationPayload {
  collegeId: string;
  routeId: string;
  documents?: FormData;
}

export const applicationService = {
};