const providerOptions = require("../config/providers");
import { createProviders, createResult, searchProviders } from "../helpers";
import { Express, Request, Response } from "express";

const path = process.cwd();

export default (app: Express) => {
  app.get("/", function(req: Request, res: Response) {
    res.sendFile(path + "/dist/index.html");
  });

  app.get("/search/:search", (req: Request, res: Response) => {
    const search = req.params.search;

    searchProviders(createProviders(providerOptions), search, res)
      .then(createResult(res, search))
      .catch(error => {
        console.log(error);
      });
  });
};
