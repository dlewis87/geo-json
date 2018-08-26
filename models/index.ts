import { GeoJSON } from "geojson";

export interface IDistricts {
  features: GeoJSON[];
}

export interface IAddressNotFound {
  status: string;
  search: string;
}

export interface IAddressFound {
  status: string;
  search: string;
  location: ILocation;
}

export interface ILocation {
  addressNumber?: string;
  addressStreet?: string;
  city?: string;
  postcode?: string;
  lat?: number;
  lng?: number;
  serviceArea: string[];
}
