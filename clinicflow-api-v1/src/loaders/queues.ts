import { Queue, Worker, Job } from "bullmq";
import config from "@/config";

let reminderQueue: Queue | null = null;
let reminderWorker: Worker | null = null;

export async function queuesLoader(): Promise<void> {
  try {
    const connection = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
    };

    reminderQueue = new Queue("appointment-reminders", { connection });

    reminderWorker = new Worker(
      "appointment-reminders",
      async (job: Job) => {
        console.log(`[BullMQ Worker] Processing reminder for appointment ${job.data.appointmentId}`);
      },
      { connection }
    );

    reminderWorker.on("failed", (job, err) => {
      console.warn(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
    });

    console.log("BullMQ + Redis Queue Loader initialized!");
  } catch (err: any) {
    console.warn("Redis not reachable. Background message queue running in standby mode:", err.message);
  }
}

export function getReminderQueue(): Queue | null {
  return reminderQueue;
}

export default queuesLoader;
