"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providerOptions = require("../config/providers");
const helpers_1 = require("../helpers");
const path = process.cwd();
exports.default = (app) => {
    app.get("/", function (req, res) {
        res.sendFile(path + "/dist/index.html");
    });
    app.get("/search/:search", (req, res) => {
        const search = req.params.search;
        helpers_1.searchProviders(helpers_1.createProviders(providerOptions), search, res).then(helpers_1.createResult(res, search)).catch(error => {
            console.log(error);
        });
    });
};
//# sourceMappingURL=routes.js.map