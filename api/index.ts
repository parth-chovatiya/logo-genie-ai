import express from "express";
import { mountRoutes } from "../server/routes";

// Create a single Express instance for the serverless function
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
function init() {
  if (initialized) return;
  mountRoutes(app);
  initialized = true;
}

export default function handler(req: any, res: any) {
  init();
  return (app as any)(req, res);
}
