"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const points_within_polygon_1 = __importDefault(require("@turf/points-within-polygon"));
const helpers_1 = require("@turf/helpers");
const fs = require("fs");
let districts = null;
const handleJSONFile = function (err, data) {
    if (err) {
        throw err;
    }
    districts = JSON.parse(data);
};
fs.readFile("./formatted-districts.json", handleJSONFile);
exports.getDistricts = (lng, lat) => {
    const features = districts.features;
    return features
        .filter((feature) => {
        const result = points_within_polygon_1.default(helpers_1.point([lng, lat]), feature);
        return result.features.length > 0;
    })
        .map((feature) => feature.properties.Name);
};
//# sourceMappingURL=index.js.map