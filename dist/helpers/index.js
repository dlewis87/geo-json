"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const points_within_polygon_1 = __importDefault(require("@turf/points-within-polygon"));
const helpers_1 = require("@turf/helpers");
const keys = require("../config/keys");
const fs = require("fs");
exports.createProviderOptions = (provider) => {
    let options = {};
    switch (provider) {
        case "google":
            options = { apiKey: keys.google_maps_key };
            break;
        case "here":
            options = { appId: keys.here_app_id, appCode: keys.here_app_code };
            break;
    }
    return Object.assign({}, options, { provider: provider, httpAdapter: "https" });
};
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
exports.addressNotFound = (search) => {
    return {
        status: "NOT_FOUND",
        search: search
    };
};
exports.addressFound = (search, result, districts) => {
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
//# sourceMappingURL=index.js.map