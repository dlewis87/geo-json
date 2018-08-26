import NodeGeocoder from "node-geocoder";
const keys = require("../config/keys");
import { getDistricts } from "../helpers";
import { Express } from "express";

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

export default (app: Express) => {
  app.get("/search/:postcode", (req, res) => {
    // @ts-ignore
    const google = NodeGeocoder(googleOptions);
    // const here = NodeGeocoder(hereOptions);

    const postcode = req.params.postcode;
    google
      .geocode(postcode)
      .then(function(result: any) {
        if (result.length === 0) {
          res.send({
            status: "NOT_FOUND",
            search: postcode
          });

          return;
        }

        const firstResult = result[0];

        const districts = getDistricts(
          firstResult.longitude,
          firstResult.latitude
        );

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
      .catch(function(err: any) {
        console.log(err);
      });
  });
};
