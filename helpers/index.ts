import pointsWithinPolygon from "@turf/points-within-polygon";
import { point } from "@turf/helpers";
import fs = require("fs");
import { Feature } from "geojson";
import { Entry, Geocoder, Options, Providers } from "node-geocoder";
import {IAddressFound, IAddressNotFound, IDistricts, IProviderOptions} from "../models";
import { Response } from "express";
import NodeGeocoder from "node-geocoder";

export const createProviders = (providerOptions: IProviderOptions[]): Geocoder[] => {
  return providerOptions.map((providerOption) => {
    try {
      return NodeGeocoder(createProviderOption(providerOption));
    } catch (e) {
      console.log(e);
    }
  });
};

export const createProviderOption = (provider: IProviderOptions): Options => {
  return {
    ...provider.options,
    provider: <Providers>provider.name,
    httpAdapter: "https"
  };
};

export const searchProviders = async (
  providers: Geocoder[],
  search: string,
  res: Response
): Promise<Entry[]> => {
  for (const provider of providers) {
    if (provider) {
      const result = await provider.geocode(search);

      if (result.length) {
        return result;
      }
    }
  }

  res.send(addressNotFound(search));
  return Promise.reject("Address not found by any provider");
};

export const createResult = (res: Response, search: string) => {
  return (result: Entry[]) => {
    const districts = getDistricts(result[0].longitude, result[0].latitude);

    res.send(addressFound(search, result[0], districts));
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
