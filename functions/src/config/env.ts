import {config} from "dotenv";
import path from "path";

config({
  path: path.resolve(__dirname, "../../../.env"),
});

export const env = {
  FIREBASE_WEB_API_KEY: process.env["FIREBASE_WEB_API_KEY"],
  FIREBASE_API_KEY: process.env["FIREBASE_API_KEY"],
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
};

export default env;
