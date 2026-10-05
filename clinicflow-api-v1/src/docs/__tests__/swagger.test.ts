import { describe, it, expect, vi } from "vitest";
import swaggerDocument from "../swagger";
import express from "express";
import request from "supertest";
import expressLoader from "@/loaders/express";

// Mock dependencies that would require active database/redis
vi.mock("@/loaders/database", () => ({
  prisma: {},
}));

vi.mock("@/services", () => ({
  EventEmitter: { emit: vi.fn(), start: vi.fn() },
  AsyncHook: {
    start: vi.fn(),
    getRequestContext: vi.fn(),
    createRequestContext: vi.fn(),
  },
  Logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe("Swagger / OpenAPI Specification", () => {
  it("should have valid OpenAPI 3.0 info metadata", () => {
    expect(swaggerDocument.openapi).toBe("3.0.3");
    expect(swaggerDocument.info.title).toBe("ClinicFlow API");
    expect(swaggerDocument.info.version).toBe("1.0.0");
  });

  it("should declare BearerAuth security scheme", () => {
    expect(swaggerDocument.components.securitySchemes.BearerAuth).toBeDefined();
    expect(swaggerDocument.components.securitySchemes.BearerAuth.type).toBe("http");
    expect(swaggerDocument.components.securitySchemes.BearerAuth.scheme).toBe("bearer");
  });

  it("should contain all key schemas", () => {
    const schemas = swaggerDocument.components.schemas;
    expect(schemas.User).toBeDefined();
    expect(schemas.Patient).toBeDefined();
    expect(schemas.Appointment).toBeDefined();
    expect(schemas.LoginRequest).toBeDefined();
    expect(schemas.LoginResponse).toBeDefined();
    expect(schemas.CreatePatientRequest).toBeDefined();
    expect(schemas.CreateAppointmentRequest).toBeDefined();
    expect(schemas.DashboardStats).toBeDefined();
  });

  it("should document core API endpoints", () => {
    const paths = swaggerDocument.paths;
    expect(paths["/api/v1/auth/login"]).toBeDefined();
    expect(paths["/api/v1/auth/me"]).toBeDefined();
    expect(paths["/api/v1/patients"]).toBeDefined();
    expect(paths["/api/v1/patients/{patientId}"]).toBeDefined();
    expect(paths["/api/v1/appointments"]).toBeDefined();
    expect(paths["/api/v1/appointments/{appointmentId}"]).toBeDefined();
    expect(paths["/api/v1/appointments/{appointmentId}/status"]).toBeDefined();
    expect(paths["/api/v1/dashboard/stats"]).toBeDefined();
  });

  it("should serve Swagger documentation routes on Express app", async () => {
    const app = express();
    expressLoader(app);

    // Test JSON spec endpoint
    const specRes = await request(app).get("/api-docs.json");
    expect(specRes.status).toBe(200);
    expect(specRes.body.openapi).toBe("3.0.3");
    expect(specRes.body.info.title).toBe("ClinicFlow API");

    // Test root /api redirect to docs
    const apiRes = await request(app).get("/api");
    expect(apiRes.status).toBe(302);
    expect(apiRes.header.location).toBe("/docs");
  });

  it("should respond with correct CORS headers on preflight OPTIONS requests", async () => {
    const app = express();
    expressLoader(app);

    const res = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "Content-Type, Authorization");

    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
    expect(res.headers["access-control-allow-methods"]).toContain("POST");
  });
});
