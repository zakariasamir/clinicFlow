import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import config from "@/config";
import { handleErrors, attachJWT } from "@/middlewares";
import mainRoutes from "@/routes";
import { AsyncHook } from "@/services";
import swaggerDocument from "@/docs/swagger";

export default function expressLoader(app: Application) {
  app.enable("trust proxy");

  // 1. CORS middleware - Must be registered first to handle all preflight OPTIONS and cross-origin requests
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        const allowedOrigins = [
          config.cors.origin,
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:4173",
          "http://127.0.0.1:3000",
        ];
        if (
          config.nodeEnv === "development" ||
          allowedOrigins.includes(origin) ||
          /^http:\/\/localhost:\d+$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
        ) {
          return callback(null, true);
        }
        return callback(null, config.cors.origin);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression());

  // Health Check endpoints
  app.get("/version", (_req: Request, res: Response) => {
    res.status(200).json({ version: "v1.0.0", name: "clinicflow-api" });
  });

  app.get("/status", (_req: Request, res: Response) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });

  app.get("/env", (_req: Request, res: Response) => {
    res.status(200).json({ env: config.apiEnv, nodeEnv: config.nodeEnv });
  });

  app.get("/host", (req: Request, res: Response) => {
    res.status(200).json({ host: req.headers.host });
  });

  // Swagger / OpenAPI documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api-docs.json", (_req: Request, res: Response) => {
    res.status(200).json(swaggerDocument);
  });
  app.get("/docs.json", (_req: Request, res: Response) => {
    res.status(200).json(swaggerDocument);
  });

  // Redirect exact /api root visits to documentation
  app.get(["/api", "/api/"], (_req: Request, res: Response) => {
    res.redirect("/docs");
  });

  // Attach JWT middleware globally
  app.use(attachJWT);

  // Request context hook
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const data = { originalUrl: req?.originalUrl };
    AsyncHook.createRequestContext(data);
    next();
  });

  // Mount API routes
  app.use(`${config.api.prefix}`, mainRoutes);

  // Catch 404 errors
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next({ success: false, status: 404, message: "Endpoint not found" });
  });

  // Central error handler
  app.use(handleErrors);
}
