"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const helpers_1 = require("../helpers");
const path = process.cwd();
const hereOptions = helpers_1.createProviderOptions("here");
const googleOptions = helpers_1.createProviderOptions("google");
exports.default = (app) => {
    app.get("/", function (req, res) {
        res.sendFile(path + "/dist/index.html");
    });
    app.get("/search/:search", (req, res) => {
        const google = node_geocoder_1.default(googleOptions);
        const search = req.params.search;
        google
            .geocode(search)
            .then(function (result) {
            if (result.length === 0) {
                res.send(helpers_1.addressNotFound(search));
                return;
            }
            const firstResult = result[0];
            const districts = helpers_1.getDistricts(firstResult.longitude, firstResult.latitude);
            res.send(helpers_1.addressFound(search, firstResult, districts));
        })
            .catch(function (err) {
            console.log(err);
            const here = node_geocoder_1.default(hereOptions);
            here
                .geocode(search)
                .then(function (result) {
                if (result.length === 0) {
                    res.send(helpers_1.addressNotFound(search));
                    return;
                }
                const firstResult = result[0];
                const districts = helpers_1.getDistricts(firstResult.longitude, firstResult.latitude);
                res.send(helpers_1.addressFound(search, firstResult, districts));
            })
                .catch(function (err) {
                console.log(err);
                res.sendStatus(503);
            });
        });
    });
};
//# sourceMappingURL=routes.js.map