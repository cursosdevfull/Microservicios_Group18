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
    ROUTING_KEY_PREFIX: z.string().default("APPOINTMENT"),
    TOPIC_NAMES: z.string().default("APPOINTMENT_CL,APPOINTMENT_CO,APPOINTMENT_PE,APPOINTMENT_DLQ"),
    CLIENT_ID: z.string().default("appointment-service"),
    BROKER: z.string().default("localhost:9092")
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
