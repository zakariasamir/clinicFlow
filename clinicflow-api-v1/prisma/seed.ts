import { PrismaClient, Role, AppointmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addHours, subHours, subDays, addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting ClinicFlow database seeding...");

  // 1. Clean existing records (in reverse FK order)
  await prisma.auditLog.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Hash passwords
  const adminPasswordHash = await bcrypt.hash("Admin@123456", 10);
  const staffPasswordHash = await bcrypt.hash("Staff@123456", 10);

  // 3. Seed Users (1 Admin, 2 Staff)
  const admin = await prisma.user.create({
    data: {
      email: "admin@clinicflow.local",
      passwordHash: adminPasswordHash,
      fullName: "Dr. Tarik Alami (Directeur)",
      role: Role.ADMIN,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      email: "dr.yasmine@clinicflow.local",
      passwordHash: staffPasswordHash,
      fullName: "Dr. Yasmine Benkirane (Généraliste)",
      role: Role.STAFF,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      email: "assistant.karim@clinicflow.local",
      passwordHash: staffPasswordHash,
      fullName: "Karim Tazi (Secrétaire médical)",
      role: Role.STAFF,
    },
  });

  console.log("Seeded 3 Users (1 Admin, 2 Staff)");

  // 4. Seed 5 Patients
  const patient1 = await prisma.patient.create({
    data: {
      fullName: "Amine Bennani",
      cin: "AB102938",
      phone: "+212 661-234567",
      birthDate: new Date("1988-04-12"),
      address: "14 Boulevard Zerktouni, Casablanca",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      fullName: "Salma Mansouri",
      cin: "CD293847",
      phone: "+212 662-345678",
      birthDate: new Date("1995-11-23"),
      address: "22 Rue de Fès, Agdal, Rabat",
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      fullName: "Omar El Amrani",
      cin: "EF384756",
      phone: "+212 663-456789",
      birthDate: new Date("1976-08-05"),
      address: "5 Avenue Hassan II, Guéliz, Marrakech",
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      fullName: "Fatima Zahra Chaoui",
      cin: "GH475869",
      phone: "+212 664-567890",
      birthDate: new Date("2001-01-19"),
      address: "88 Rue Ibn Sina, Malabata, Tanger",
    },
  });

  const patient5 = await prisma.patient.create({
    data: {
      fullName: "Youssef Touimi",
      cin: "JK586970",
      phone: "+212 665-678901",
      birthDate: new Date("1992-06-30"),
      address: "12 Avenue Mohamed V, Agadir",
    },
  });

  console.log("Seeded 5 Patients");

  // 5. Seed 10 Appointments (Carefully timed with no 30-min window conflicts)
  const now = new Date();
  const todayAt = (hours: number, minutes: number) => setMinutes(setHours(now, hours), minutes);

  const appointmentsData = [
    // Today's appointments (4 appointments: 2 confirmed, 1 pending, 1 cancelled)
    {
      patientId: patient1.id,
      createdById: staff2.id,
      appointmentDate: todayAt(9, 30),
      status: AppointmentStatus.CONFIRMED,
      reason: "Consultation générale & contrôle tension",
      notes: "Patient à jeun pour prise de sang de contrôle.",
    },
    {
      patientId: patient2.id,
      createdById: staff2.id,
      appointmentDate: todayAt(11, 0),
      status: AppointmentStatus.CONFIRMED,
      reason: "Bilan biologique annuel",
      notes: "Suivi post-traitement ferritine.",
    },
    {
      patientId: patient3.id,
      createdById: staff1.id,
      appointmentDate: todayAt(14, 30),
      status: AppointmentStatus.PENDING,
      reason: "Douleurs articulaires genou droit",
      notes: "Apporter les anciennes radiographies.",
    },
    {
      patientId: patient4.id,
      createdById: staff2.id,
      appointmentDate: todayAt(16, 0),
      status: AppointmentStatus.CANCELLED,
      reason: "Renouvellement ordonnance asthme",
      notes: "Annulé par le patient ce matin.",
    },

    // Tomorrow's appointments (3 appointments: 2 pending, 1 confirmed)
    {
      patientId: patient5.id,
      createdById: staff1.id,
      appointmentDate: addDays(todayAt(10, 0), 1),
      status: AppointmentStatus.CONFIRMED,
      reason: "Certificat médical d'aptitude sportive",
      notes: "ECG de repos à prévoir.",
    },
    {
      patientId: patient1.id,
      createdById: staff2.id,
      appointmentDate: addDays(todayAt(11, 30), 1),
      status: AppointmentStatus.PENDING,
      reason: "Interprétation des résultats d'analyses",
      notes: null,
    },
    {
      patientId: patient2.id,
      createdById: admin.id,
      appointmentDate: addDays(todayAt(15, 0), 1),
      status: AppointmentStatus.PENDING,
      reason: "Consultation dermatologique - grain de beauté",
      notes: "Dermoscopie demandée.",
    },

    // Past appointments (3 appointments for history)
    {
      patientId: patient3.id,
      createdById: staff1.id,
      appointmentDate: subDays(todayAt(10, 30), 3),
      status: AppointmentStatus.CONFIRMED,
      reason: "Première visite clinique - Antécédents",
      notes: "Dossier médical ouvert avec succès.",
    },
    {
      patientId: patient4.id,
      createdById: staff2.id,
      appointmentDate: subDays(todayAt(14, 0), 5),
      status: AppointmentStatus.CONFIRMED,
      reason: "Contrôle allergie saisonnière",
      notes: "Prescription antihistaminique de 3 mois.",
    },
    {
      patientId: patient5.id,
      createdById: staff2.id,
      appointmentDate: subDays(todayAt(16, 30), 7),
      status: AppointmentStatus.CANCELLED,
      reason: "Migraines récurrentes",
      notes: "Patient indisponible pour déplacement professionnel.",
    },
  ];

  for (const appt of appointmentsData) {
    await prisma.appointment.create({ data: appt });
  }

  console.log("Seeded 10 Appointments (mix of PENDING, CONFIRMED, CANCELLED)");

  // 6. Initial AuditLog record
  await prisma.auditLog.create({
    data: {
      action: "DATABASE_INITIAL_SEED",
      entity: "system",
      entityId: admin.id,
      actorId: admin.id,
      metadata: {
        usersCount: 3,
        patientsCount: 5,
        appointmentsCount: 10,
        seededAt: new Date().toISOString(),
      },
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
