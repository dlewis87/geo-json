import NodeGeocoder, { Entry } from "node-geocoder";
import {
  getDistricts,
  addressNotFound,
  addressFound,
  createProviderOptions
} from "../helpers";
import { Express } from "express";
const path = process.cwd();

const hereOptions = createProviderOptions("here");
const googleOptions = createProviderOptions("google");

export default (app: Express) => {
  app.get("/", function(req, res) {
    res.sendFile(path + "/dist/index.html");
  });

  app.get("/search/:search", (req, res) => {
    const google = NodeGeocoder(googleOptions);
    const search = req.params.search;

    google
      .geocode(search)
      .then(function(result: Entry[]) {
        if (result.length === 0) {
          res.send(addressNotFound(search));
          return;
        }

        const firstResult = result[0];
        const districts = getDistricts(
          firstResult.longitude,
          firstResult.latitude
        );

        res.send(addressFound(search, firstResult, districts));
      })
      .catch(function(err: any) {
        console.log(err);

        const here = NodeGeocoder(hereOptions);
        here
          .geocode(search)
          .then(function(result: Entry[]) {
            if (result.length === 0) {
              res.send(addressNotFound(search));
              return;
            }

            const firstResult = result[0];
            const districts = getDistricts(
              firstResult.longitude,
              firstResult.latitude
            );

            res.send(addressFound(search, firstResult, districts));
          })
          .catch(function(err: any) {
            console.log(err);
            res.sendStatus(503);
          });
      });
  });
};
