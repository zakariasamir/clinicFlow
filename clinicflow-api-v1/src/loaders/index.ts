import { Application } from "express";
import { AsyncHook, EventEmitter, Logger } from "@/services";
import expressLoader from "./express";
import databaseLoader from "./database";

export default async function init(app: Application) {
  Logger.info(`Running with NODE_ENV = ${process.env.NODE_ENV} environment`);
  Logger.info(`Running with API_ENV = ${process.env.API_ENV} environment`);

  await databaseLoader();
  Logger.info("DB loaded and connected!");

  AsyncHook.start();
  Logger.info("Async Hook Started!");

  EventEmitter.start();
  Logger.info("Event Emitter Started!");

  expressLoader(app);
  Logger.info("Express app loaded!");
}
