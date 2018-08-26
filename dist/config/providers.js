const keys = require("../config/keys");
module.exports = [
    {
        name: "google",
        options: {
            apiKey: keys.google_maps_key
        }
    },
    {
        name: "here",
        options: {
            appId: keys.here_app_id,
            appCode: keys.here_app_code
        }
    }
];
//# sourceMappingURL=providers.js.map