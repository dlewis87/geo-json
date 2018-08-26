import pointsWithinPolygon from "@turf/points-within-polygon";
import { point } from "@turf/helpers";
const keys = require("../config/keys");
import fs = require("fs");
import { Feature } from "geojson";
import { Entry, Options, Providers } from "node-geocoder";
import { IAddressFound, IAddressNotFound, IDistricts } from "../models";

export const createProviderOptions = (provider: string): Options => {
  let options = {};

  switch (provider) {
    case "google":
      options = { apiKey: keys.google_maps_key };
      break;
    case "here":
      options = { appId: keys.here_app_id, appCode: keys.here_app_code };
      break;
  }

  return {
    ...options,
    provider: <Providers>provider,
    httpAdapter: "https"
  };
};

let districts: IDistricts = null;

const handleJSONFile = function(err: any, data: any) {
  if (err) {
    throw err;
  }
  districts = JSON.parse(data);
};

fs.readFile("./formatted-districts.json", handleJSONFile);

export const getDistricts = (lng: number, lat: number): string[] => {
  const features = districts.features;

  return features
    .filter((feature: Feature) => {
      const result = pointsWithinPolygon(point([lng, lat]), feature);

      return result.features.length > 0;
    })
    .map((feature: Feature) => feature.properties.Name);
};

export const addressNotFound = (search: string): IAddressNotFound => {
  return {
    status: "NOT_FOUND",
    search: search
  };
};

export const addressFound = (
  search: string,
  result: Entry,
  districts: string[]
): IAddressFound => {
  return {
    status: "OK",
    search: search,
    location: {
      addressNumber: result.streetNumber || null,
      addressStreet: result.streetName || null,
      city: result.city || null,
      postcode: result.zipcode || null,
      lat: result.latitude || null,
      lng: result.longitude || null,
      serviceArea: districts
    }
  };
};
