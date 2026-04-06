import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface College {
  _id: string;
  name: string;
  address: string;
  district: string;
}

export interface Route {
  _id: string;
  name: string;
  stops: string[];
  fare: number;
  active: boolean;
}

export interface BusStandLocation {
  id: string;
  name: string;
  state: string;
  district: string;
  note?: string;
  latitude?: number;
  longitude?: number;
}

export const collegeService = {
  getColleges: async (): Promise<College[]> => {
    const response = await apiClient.get<{ colleges: College[] }>(ENDPOINTS.COLLEGES.LIST);
    return response.data.colleges ?? [];
  },

  createCollege: async (payload: Omit<College, "_id">): Promise<College> => {
    const response = await apiClient.post<{ college: College }>(ENDPOINTS.COLLEGES.CREATE, payload);
    return response.data.college;
  },

  updateCollege: async (id: string, payload: Partial<Omit<College, "_id">>): Promise<College> => {
    const response = await apiClient.put<{ college: College }>(ENDPOINTS.COLLEGES.UPDATE(id), payload);
    return response.data.college;
  },

  deleteCollege: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.COLLEGES.DELETE(id));
  },
};

export const routeService = {
};

export const locationService = {
  getStates: async (): Promise<string[]> => {
    const response = await apiClient.get<{ states: string[] }>(ENDPOINTS.RESOURCES.STATES);
    return response.data.states ?? [];
  },

  getDistricts: async (state: string): Promise<string[]> => {
    const response = await apiClient.get<{ districts: string[] }>(ENDPOINTS.RESOURCES.DISTRICTS(state));
    return response.data.districts ?? [];
  },

  getBusStands: async (state: string, district: string): Promise<BusStandLocation[]> => {
    const response = await apiClient.get<{ busStands: BusStandLocation[] }>(
      ENDPOINTS.RESOURCES.BUS_STANDS(state, district),
    );
    return response.data.busStands ?? [];
  },
};
