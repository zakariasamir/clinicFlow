export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "ClinicFlow API",
    version: "1.0.0",
    description:
      "ClinicFlow Modular Monolith REST API with 3-Tier Layered Architecture for Clinic & Patient Management.\n\n" +
      "### Authentication\n" +
      "All protected endpoints require a JWT Bearer token in the `Authorization` header (`Bearer <token>`).\n" +
      "Obtain your token via the `POST /api/v1/auth/login` endpoint.",
    contact: {
      name: "ClinicFlow Team",
      url: "https://clinicflow.local",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication and user identity" },
    { name: "Patients", description: "Patient records, search, and medical file management" },
    { name: "Appointments", description: "Appointment scheduling, status workflow, and 30-min window conflict validation" },
    { name: "Dashboard", description: "Clinic overview metrics and analytics" },
    { name: "Health", description: "Server diagnostics and system health endpoints" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your Bearer JWT token from /api/v1/auth/login",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          status: { type: "integer", example: 400 },
          message: { type: "string", example: "Invalid request parameters" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer", example: 50 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 5 },
          hasNextPage: { type: "boolean", example: true },
          hasPrevPage: { type: "boolean", example: false },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
          email: { type: "string", format: "email", example: "admin@clinicflow.local" },
          fullName: { type: "string", example: "Dr. Tarik Alami" },
          role: { type: "string", enum: ["ADMIN", "STAFF"], example: "ADMIN" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@clinicflow.local" },
          password: { type: "string", format: "password", example: "Admin@123456" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            },
          },
        },
      },
      Patient: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
          fullName: { type: "string", example: "Amine Bennani" },
          cin: { type: "string", example: "AB102938" },
          phone: { type: "string", example: "+212 661-234567" },
          birthDate: { type: "string", format: "date", example: "1988-04-12" },
          address: { type: "string", nullable: true, example: "14 Boulevard d'Anfa, Casablanca" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          _count: {
            type: "object",
            properties: {
              appointments: { type: "integer", example: 3 },
            },
          },
        },
      },
      CreatePatientRequest: {
        type: "object",
        required: ["fullName", "cin", "phone", "birthDate"],
        properties: {
          fullName: { type: "string", example: "Khadija Mansouri" },
          cin: { type: "string", example: "BK992831" },
          phone: { type: "string", example: "+212 662-345678" },
          birthDate: { type: "string", format: "date", example: "1990-11-20" },
          address: { type: "string", nullable: true, example: "45 Rue de Fes, Rabat" },
        },
      },
      UpdatePatientRequest: {
        type: "object",
        properties: {
          fullName: { type: "string", example: "Khadija Mansouri" },
          cin: { type: "string", example: "BK992831" },
          phone: { type: "string", example: "+212 662-345678" },
          birthDate: { type: "string", format: "date", example: "1990-11-20" },
          address: { type: "string", nullable: true, example: "45 Rue de Fes, Rabat" },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "d9e8f7a6-b5c4-3210-fedc-ba9876543210" },
          patientId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
          createdById: { type: "string", format: "uuid", nullable: true },
          appointmentDate: { type: "string", format: "date-time", example: "2026-10-10T10:00:00.000Z" },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], example: "CONFIRMED" },
          reason: { type: "string", example: "Consultation générale & bilan sanguin" },
          notes: { type: "string", nullable: true, example: "Patient à jeun" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          patient: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              fullName: { type: "string", example: "Amine Bennani" },
              cin: { type: "string", example: "AB102938" },
              phone: { type: "string", example: "+212 661-234567" },
            },
          },
          creator: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "string", format: "uuid" },
              fullName: { type: "string", example: "Dr. Yasmine Benkirane" },
              role: { type: "string", enum: ["ADMIN", "STAFF"] },
            },
          },
        },
      },
      CreateAppointmentRequest: {
        type: "object",
        required: ["patientId", "appointmentDate", "reason"],
        properties: {
          patientId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
          appointmentDate: { type: "string", format: "date-time", example: "2026-10-12T14:30:00.000Z" },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
          reason: { type: "string", example: "Contrôle annuel et renouvellement traitement" },
          notes: { type: "string", nullable: true, example: "Dossier précédent archivé" },
        },
      },
      UpdateAppointmentStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], example: "CONFIRMED" },
        },
      },
      DashboardStats: {
        type: "object",
        properties: {
          totalPatients: { type: "integer", example: 142 },
          totalAppointments: { type: "integer", example: 380 },
          todayAppointments: { type: "integer", example: 8 },
          pendingAppointments: { type: "integer", example: 3 },
          confirmedAppointments: { type: "integer", example: 4 },
          cancelledAppointments: { type: "integer", example: 1 },
        },
      },
    },
  },
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        description: "Authenticate with email and password to receive a JWT Bearer token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          400: {
            description: "Missing or invalid credentials",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          401: {
            description: "Invalid email or password",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        description: "Returns the profile of the authenticated user extracted from the JWT token.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Authenticated user details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - missing or invalid token",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/patients": {
      get: {
        tags: ["Patients"],
        summary: "List patients with pagination and search",
        description: "Retrieves a paginated list of patients. Supports case-insensitive search by name, CIN, or phone.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Search filter for fullName, CIN, or phone",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            description: "Page number (defaults to 1)",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (defaults to 10)",
            required: false,
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Paginated list of patients",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Patient" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      post: {
        tags: ["Patients"],
        summary: "Create a new patient",
        description: "Registers a new patient. CIN must be unique.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePatientRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Patient created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          409: {
            description: "Patient with this CIN already exists",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/patients/{patientId}": {
      get: {
        tags: ["Patients"],
        summary: "Get patient details by ID",
        description: "Retrieves complete patient information including their appointment history.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "patientId",
            in: "path",
            required: true,
            description: "Patient UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Patient record found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
          404: {
            description: "Patient not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      put: {
        tags: ["Patients"],
        summary: "Update patient by ID",
        description: "Updates patient contact and demographic details. Verifies CIN uniqueness if changed.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "patientId",
            in: "path",
            required: true,
            description: "Patient UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePatientRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Patient updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Patient" },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          404: {
            description: "Patient not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          409: {
            description: "CIN collision with another patient",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      delete: {
        tags: ["Patients"],
        summary: "Delete patient (Soft delete - Admin only)",
        description: "Soft deletes the patient and triggers an audit log entry. Restricted to ADMIN role.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "patientId",
            in: "path",
            required: true,
            description: "Patient UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Patient deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Patient supprimé avec succès." },
                  },
                },
              },
            },
          },
          403: {
            description: "Forbidden - Administrator privilege required",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          404: {
            description: "Patient not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "List appointments with date and status filters",
        description: "Retrieves upcoming and scheduled appointments. Can be filtered by specific date and status (PENDING, CONFIRMED, CANCELLED).",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "date",
            in: "query",
            description: "Filter appointments on this day (ISO date: YYYY-MM-DD)",
            required: false,
            schema: { type: "string", format: "date" },
          },
          {
            name: "status",
            in: "query",
            description: "Filter by status: PENDING, CONFIRMED, CANCELLED, or ALL",
            required: false,
            schema: { type: "string", enum: ["ALL", "PENDING", "CONFIRMED", "CANCELLED"] },
          },
        ],
        responses: {
          200: {
            description: "List of matching appointments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Appointment" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
      post: {
        tags: ["Appointments"],
        summary: "Create a new appointment",
        description: "Creates an appointment for a patient. If status is CONFIRMED, enforces a 30-minute conflict validation window.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAppointmentRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Appointment created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields or 30-min scheduling conflict",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          404: {
            description: "Patient not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/appointments/{appointmentId}": {
      get: {
        tags: ["Appointments"],
        summary: "Get appointment details by ID",
        description: "Retrieves details of an appointment including associated patient and creator information.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "appointmentId",
            in: "path",
            required: true,
            description: "Appointment UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Appointment found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          404: {
            description: "Appointment not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/appointments/{appointmentId}/status": {
      patch: {
        tags: ["Appointments"],
        summary: "Update appointment status",
        description: "Transitions appointment status (PENDING, CONFIRMED, CANCELLED). Validates 30-min window when confirming.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "appointmentId",
            in: "path",
            required: true,
            description: "Appointment UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAppointmentStatusRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid status value or scheduling conflict window",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          404: {
            description: "Appointment not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/v1/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Get clinic dashboard statistics",
        description: "Returns summary counts of patients, total appointments, today's appointments, and breakdown by status.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/DashboardStats" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/version": {
      get: {
        tags: ["Health"],
        summary: "Get API version",
        responses: {
          200: {
            description: "API version info",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    version: { type: "string", example: "v1.0.0" },
                    name: { type: "string", example: "clinicflow-api" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/status": {
      get: {
        tags: ["Health"],
        summary: "Get service uptime and status",
        responses: {
          200: {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    uptime: { type: "number", example: 123.45 },
                    message: { type: "string", example: "Ok" },
                    date: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/env": {
      get: {
        tags: ["Health"],
        summary: "Get environment configuration",
        responses: {
          200: {
            description: "Current environment",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    env: { type: "string", example: "local" },
                    nodeEnv: { type: "string", example: "development" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/host": {
      get: {
        tags: ["Health"],
        summary: "Get host header",
        responses: {
          200: {
            description: "Host header value",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    host: { type: "string", example: "localhost:5000" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
