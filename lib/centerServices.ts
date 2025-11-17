/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  Country,
  State,
  District,
  Center,
  CountriesResponse,
  StatesResponse,
  DistrictsResponse,
  CentersResponse,
  CenterResponse,
} from "@/types/centers";
import { API_URL } from "@/lib/config";

export const centerService = {
  // Get all countries with counts
  getCountries: async (): Promise<Country[]> => {
    const response = await axios.get<CountriesResponse>(
      `${API_URL}/centers/countries`
    );
    // console.log(response.data.data);
    return response.data.data.countries;
  },

  // Get states by country with counts
  getCountryStates: async (country: string): Promise<State[]> => {
    const response = await axios.get<StatesResponse>(
      `${API_URL}/centers/countries-with-states/${country}`
    );
    return response.data.data.states;
  },

  // Get districts by country and state
  getDistricts: async (country: string, state: string): Promise<District[]> => {
    const response = await axios.post<DistrictsResponse>(
      `${API_URL}/centers/districts`,
      {
        country,
        state,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.data.districts;
  },

  // Get centers in district
  getCentersInDistrict: async (
    country: string,
    state: string,
    district: string
  ): Promise<Center[]> => {
    const response = await axios.post<CentersResponse>(
      `${API_URL}/centers/district/center-list`,
      {
        country,
        state,
        district,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.data.centers;
  },

  // Get center by ID
  getCenter: async (id: string): Promise<Center> => {
    const response = await axios.get<CenterResponse>(
      `${API_URL}/centers/center/${id}`
    );
    return response.data.data;
  },

  // Find nearby centers
  findNearbyCenters: async (data: {
    latitude: number;
    longitude: number;
  }): Promise<Center[]> => {
    const response = await axios.post(
      `${API_URL}/centers/find-centers-nearby`,
      {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      {
        withCredentials: true,
      }
    );
    // console.log(response.data.data.centers);
    return response.data.data.centers;
  },

  // Search centers
  searchCenters: async (query: string, filters?: any): Promise<Center[]> => {
    const response = await axios.get(`${API_URL}/centers/search`, {
      params: { q: query, ...filters },
    });
    // console.log(response.data.data);
    return response.data.data.results;
  },
};
