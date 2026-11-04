import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import "./config/env";
import {app} from "./app";

setGlobalOptions({
  region: "asia-south1",
  maxInstances: 10,
});

export const api = onRequest(app);
