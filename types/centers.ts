export interface Country {
  country: string;
  count: number;
}

export interface State {
  state: string;
  totalCenters: number;
}

export interface District {
  district: string;
  totalCenters: number;
}

export interface Coordinator {
  name: string;
  phone: string;
  email: string;
}

export interface Center {
  id: string;
  Country: string;
  State: string;
  District: string;
  schedule: string;
  Address: string;
  Description: string;
  coordinators: Coordinator[];
  latitude: number;
  longitude: number;
  centerImage: string | null;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface NearbyCenterRequest {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface CountriesResponse {
  statusCode: number;
  data: {
    countries: Country[];
  };
  message: string;
  success: boolean;
}

export interface StatesResponse {
  statusCode: number;
  data: {
    country: string;
    states: State[];
  };
  message: string;
  success: boolean;
}

export interface DistrictsResponse {
  statusCode: number;
  data: {
    country: string;
    state: string;
    districts: District[];
  };
  message: string;
  success: boolean;
}

export interface CentersResponse {
  statusCode: number;
  data: {
    centers: Center[];
    totalCenters: number;
  };
  message: string;
  success: boolean;
}

export interface CenterResponse {
  statusCode: number;
  data: Center;
  message: string;
  success: boolean;
}
