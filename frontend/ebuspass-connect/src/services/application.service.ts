
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export type ApplicationStatus =
  | "pending"
  | "pay_pending"
  | "under_review"
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

export interface SaveRouteSelectionPayload {
  source: string;
  destination: string;
  distance: number;
  fare: number;
  routeId?: string;
}

export type AdminApplicationStatus = "pending" | "pay_pending" | "under_review" | "approved" | "rejected";

export interface ApplicationUserSummary {
  _id: string;
  fullname: string;
  email: string;
  mobile: string;
}

export interface AdminApplication {
  _id: string;
  userId: string | ApplicationUserSummary;
  status: AdminApplicationStatus;
  personalDetails: {
    fullName: string;
    dob: string;
    gender: "male" | "female" | "other";
    mobile: string;
    email: string;
    address: string;
    collegeName: string;
    course: string;
    yearSemester: string;
  };
  documents: {
    aadhaar: string;
    collegeId: string;
    photo: string;
  };
  route: {
    routeId?: string;
    source: string;
    destination: string;
    distance: number;
    fare: number;
  };
  payment: {
    status: "pending" | "completed" | "failed";
    amount: number;
    transactionId?: string;
    method?: "UPI" | "Debit Card" | "Credit Card" | "Net Banking";
    date?: string;
  };
  remarks?: string;
  passValidityStart?: string;
  passValidityEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateApplicationRequest {
  personalDetails: SaveBasicDetailsPayload;
  documents: {
    aadhaar: string;
    collegeId: string;
    photo: string;
  };
  route: {
    source: string;
    destination: string;
    distance: number;
    fare: number;
    routeId?: string;
  };
  payment: {
    status: "pending" | "completed" | "failed";
    amount: number;
    transactionId?: string;
    method?: "UPI" | "Debit Card" | "Credit Card" | "Net Banking";
    date?: string;
  };
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

  saveRouteSelection: async (route: SaveRouteSelectionPayload) => {
    const response = await apiClient.post(ENDPOINTS.APPLICATIONS.ROUTE_SELECTION, {
      route,
    });

    return response.data;
  },

  createApplication: async (payload: CreateApplicationRequest): Promise<AdminApplication> => {
    const response = await apiClient.post<{ application: AdminApplication }>(ENDPOINTS.APPLICATIONS.CREATE, payload);
    return response.data.application;
  },

  completeApplicationPayment: async (
    applicationId: string,
    payment: CreateApplicationRequest["payment"],
  ): Promise<AdminApplication> => {
    const response = await apiClient.put<{ application: AdminApplication }>(
      ENDPOINTS.APPLICATIONS.UPDATE_PAYMENT(applicationId),
      { payment },
    );

    return response.data.application;
  },

  getAllApplicationsForAdmin: async (params?: {
    status?: AdminApplicationStatus;
    page?: number;
    limit?: number;
  }): Promise<{ applications: AdminApplication[]; pagination: ApplicationPagination }> => {
    const response = await apiClient.get<{
      applications: AdminApplication[];
      pagination: ApplicationPagination;
    }>(ENDPOINTS.APPLICATIONS.GET_ALL, {
      params,
    });

    return {
      applications: response.data.applications ?? [],
      pagination: response.data.pagination,
    };
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: AdminApplicationStatus,
    remarks?: string,
  ): Promise<AdminApplication> => {
    const response = await apiClient.put<{ application: AdminApplication }>(
      ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
      { status, remarks },
    );

    return response.data.application;
  },
};