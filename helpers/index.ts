import pointsWithinPolygon from "@turf/points-within-polygon";
import { point } from "@turf/helpers";
import fs = require("fs");
import { Feature, GeoJSON } from "geojson";

interface IDistricts {
  features: GeoJSON[];
}

let districts: IDistricts = null;

const handleJSONFile = function(err: any, data: any) {
  if (err) {
    throw err;
  }
  districts = JSON.parse(data);
};

fs.readFile("./formatted-districts.json", handleJSONFile);

export const getDistricts = (lng: number, lat: number) => {
  const features = districts.features;

  return features
    .filter((feature: Feature) => {
      const result = pointsWithinPolygon(point([lng, lat]), feature);

      return result.features.length > 0;
    })
    .map((feature: Feature) => feature.properties.Name);
};
