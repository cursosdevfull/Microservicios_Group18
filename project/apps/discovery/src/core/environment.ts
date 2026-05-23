import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    API_APPOINTMENT_URL_CL: z.string().default("http://localhost:3020/api/v1/appointment"),
    API_APPOINTMENT_URL_CO: z.string().default("http://localhost:3030/api/v1/appointment"),
    API_APPOINTMENT_URL_PE: z.string().default("http://localhost:3040/api/v1/appointment"),
})

type Env = z.infer<typeof envSchema>

export const env:Env = envSchema.parse(process.env)
