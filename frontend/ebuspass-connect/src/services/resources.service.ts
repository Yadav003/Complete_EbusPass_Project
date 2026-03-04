// import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface College {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Route {
  _id: string;
  name: string;
  stops: string[];
  fare: number;
  active: boolean;
}

export const collegeService = {

};

export const routeService = {
};
