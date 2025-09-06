import express from "express";
import { registerRoutes } from "../server/routes";

// Create a single Express instance for the serverless function
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
async function init() {
  if (initialized) return;
  await registerRoutes(app);
  initialized = true;
}

export default async function handler(req: any, res: any) {
  await init();
  return (app as any)(req, res);
}
