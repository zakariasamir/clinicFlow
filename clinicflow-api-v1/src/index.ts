import express from "express";
import config from "@/config";
import Loaders from "@/loaders";

async function start() {
  const app = express();
  await Loaders(app);
  app.listen(config.port, () => {
    console.log(`
      ################################################
      Server listening on port: ${config.port}
      Environment: ${config.nodeEnv} (${config.apiEnv})
      API Base URL: http://localhost:${config.port}${config.api.prefix}
      Swagger UI: http://localhost:${config.port}/docs
      ################################################
    `);
  });
}

start();
