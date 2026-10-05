import { Request, Router } from "express";
import PatientModule from "@/modules/patient";
import { createPatientSchema } from "@/modules/patient/patient.validation";
import { authenticate } from "@/middlewares";
import { Errors } from "@/utils";

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /patients?search=&page=&limit=
 */
router.get("/", async (req: Request, res, next) => {
  try {
    const { search, page, limit } = req.query as any;

    const query: any = {
      deletedAt: null,
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchTerm = search.trim();
      query.OR = [
        { fullName: { contains: searchTerm, mode: "insensitive" } },
        { cin: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm } },
      ];
    }

    const result = await PatientModule.services.fetchAll({
      query,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      include: {
        _count: {
          select: { appointments: true },
        },
      },
      sort: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: result.docs,
      meta: {
        total: result.totalDocs,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /patients
 */
router.post("/", async (req: Request, res, next) => {
  try {
    const validatedData = createPatientSchema.parse(req.body);
    const { fullName, cin, phone, birthDate, address } = validatedData;

    const cinExists = await PatientModule.services.exists({
      query: { cin: cin.toUpperCase().trim(), deletedAt: null },
    });

    if (cinExists) {
      throw Errors.conflict(`Un patient avec le CIN '${cin}' existe déjà.`);
    }

    const patient = await PatientModule.services.createOne({
      payload: {
        fullName,
        cin: cin.toUpperCase().trim(),
        phone,
        birthDate: new Date(birthDate),
        address: address || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
