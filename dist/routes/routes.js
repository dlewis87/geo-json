"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const keys = require("../config/keys");
const helpers_1 = require("../helpers");
// const hereOptions = {
//   provider: "here",
//   httpAdapter: "https",
//   appId: keys.here_app_id,
//   appCode: keys.here_app_code,
//   method: "GET",
//   formatter: null
// };
const googleOptions = {
    provider: "google",
    httpAdapter: "https",
    apiKey: keys.google_maps_key
};
exports.default = (app) => {
    app.get("/search/:postcode", (req, res) => {
        // @ts-ignore
        const google = node_geocoder_1.default(googleOptions);
        // const here = NodeGeocoder(hereOptions);
        const postcode = req.params.postcode;
        google
            .geocode(postcode)
            .then(function (result) {
            if (result.length === 0) {
                res.send({
                    status: "NOT_FOUND",
                    search: postcode
                });
                return;
            }
            const firstResult = result[0];
            const districts = helpers_1.getDistricts(firstResult.longitude, firstResult.latitude);
            res.send({
                status: "OK",
                search: postcode,
                location: {
                    addressNumber: firstResult.streetNumber || null,
                    addressStreet: firstResult.streetName || null,
                    city: firstResult.city || null,
                    postcode: firstResult.zipcode || null,
                    lat: firstResult.latitude || null,
                    lng: firstResult.longitude || null,
                    serviceArea: districts
                }
            });
        })
            .catch(function (err) {
            console.log(err);
        });
    });
};
//# sourceMappingURL=routes.js.map