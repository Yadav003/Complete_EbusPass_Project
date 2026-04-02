
import apiClient from "./apiClient";
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

export interface SaveBasicDetailsPayload {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  collegeName: string;
  course: string;
  yearSemester: string;
}

export interface SaveDocumentsUploadPayload {
  aadhaar: File;
  collegeId: File;
  photo: File;
}

export const applicationService = {
  saveBasicDetails: async (personalDetails: SaveBasicDetailsPayload) => {
    const response = await apiClient.post(ENDPOINTS.APPLICATIONS.BASIC_DETAILS, {
      personalDetails,
    });

    return response.data;
  },

  saveDocumentsUpload: async (documents: SaveDocumentsUploadPayload) => {
    const formData = new FormData();
    formData.append("aadhaar", documents.aadhaar);
    formData.append("collegeId", documents.collegeId);
    formData.append("photo", documents.photo);

    const response = await apiClient.post(ENDPOINTS.APPLICATIONS.DOCUMENTS_UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};