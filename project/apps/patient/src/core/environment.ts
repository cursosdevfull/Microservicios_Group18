import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NAME: z.string().default("Gateway"),
    PORT: z.coerce.number().default(4000),
    HOST: z.string().default("http://localhost"),
    API_DISCOVERY_URL: z.string().default("http://localhost:3050/register"),
    INTERVAL_HEARTBEAT: z.coerce.number().default(30000),
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(3306),
    DB_USER: z.string().default("patient_user"),
    DB_PASSWORD: z.string().default("12345"),
    DB_NAME: z.string().default("patient_db"),
    DB_SYNCHRONIZE: z.coerce.boolean().default(true),
    DB_LOGGING: z.coerce.boolean().default(false),
    DB_POOL_SIZE: z.coerce.number().default(10),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
