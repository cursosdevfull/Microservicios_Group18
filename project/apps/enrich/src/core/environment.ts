import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NAME: z.string().default("Gateway"),
    PORT: z.coerce.number().default(4000),
    HOST: z.string().default("http://localhost"),
    API_DISCOVERY_URL: z.string().default("http://localhost:3050/register"),
    INTERVAL_HEARTBEAT: z.coerce.number().default(30000),
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
