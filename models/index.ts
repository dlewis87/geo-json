import { GeoJSON } from "geojson";
import { Options } from "node-geocoder";

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

export interface IProviderOption {
  name: string;
  options: Options;
}
