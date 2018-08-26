"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const points_within_polygon_1 = __importDefault(require("@turf/points-within-polygon"));
const helpers_1 = require("@turf/helpers");
const fs = require("fs");
const node_geocoder_1 = __importDefault(require("node-geocoder"));
exports.createProviders = (providerOptions) => {
    return providerOptions.map(providerOption => {
        try {
            return node_geocoder_1.default(exports.createProviderOption(providerOption));
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.createProviderOption = (provider) => {
    return Object.assign({}, provider.options, { provider: provider.name, httpAdapter: "https" });
};
exports.searchProviders = (providers, search, res) => __awaiter(this, void 0, void 0, function* () {
    for (const provider of providers) {
        if (provider) {
            const result = yield provider.geocode(search);
            if (result.length) {
                return result;
            }
        }
    }
    res.send(exports.addressNotFound(search));
    return Promise.reject("Address not found by any provider");
});
exports.createResult = (res, search) => {
    return (result) => {
        const districts = exports.getDistricts(result[0].longitude, result[0].latitude);
        res.send(exports.addressFound(search, result[0], districts));
    };
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