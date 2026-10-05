import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiEnv: process.env.API_ENV || "local",
  api: {
    prefix: process.env.API_PREFIX || "/api",
  },
  database: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/clinicflow_db?schema=public",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "game_of_rotten_thrones",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};

export default config;
