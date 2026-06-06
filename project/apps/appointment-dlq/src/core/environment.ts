import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NAME: z.string().default("Gateway"),
    PORT: z.coerce.number().default(4000),
    HOST: z.string().default("http://localhost"),
    API_DISCOVERY_URL: z.string().default("http://localhost:3050/register"),
    INTERVAL_HEARTBEAT: z.coerce.number().default(30000),
    RABBITMQ_URL: z.string().default("amqp://localhost:5672"),
    EXCHANGE_NAME: z.string().default("appointment_exchange"),
    EXCHANGE_TYPE: z.string().default("topic"),
    QUEUE_NAME: z.string().default("appointment_queue_pe"),
    ROUTING_KEY: z.string().default("APPOINTMENT.PE"),
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
