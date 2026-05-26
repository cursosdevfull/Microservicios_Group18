import { PatientApplication } from "@application/patient";
import { Request, Response } from "express";
import { z } from "zod";
import { Patient } from "../domain/patient";
import { hashPassword } from "@core/services/hash";
import * as crypto from "crypto";

export class PatientController {
    constructor(private application: PatientApplication) { }

    async create(req: Request, res: Response) {
        try {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.log("Trace ID for patient create request:", traceId); // Debugging line to check the generated trace ID
            const schema = z.object({
                name: z.string(),
                lastname: z.string(),
                email: z.string(),
                password: z.string(),
                countryISO: z.enum(["CL", "CO", "PE"]),
            })

            const validation = schema.parse(req.body);

            const refreshToken = crypto.randomUUID();

            const patient = new Patient({ ...validation, password: await hashPassword(validation.password), refreshToken });

            await this.application.create(patient)

            res.status(201).json({ message: "Patient created successfully!" });
        } catch (error) {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.error("Trace ID for patient create request:", traceId); // Debugging line to check the generated trace ID
            res.status(500).json({ message: "Error forwarding request to patient service", error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.log("Trace ID for patient login request:", traceId); // Debugging line to check the generated trace ID
            const schema = z.object({
                email: z.string(),
                password: z.string(),
            })

            const validation = schema.parse(req.body);

            const tokens = await this.application.login(validation.email, validation.password);

            if (tokens) {
                res.status(200).json(tokens);
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.error("Trace ID for patient login request:", traceId); // Debugging line to check the generated trace ID
            res.status(500).json({ message: "Error forwarding request to patient service", error });
        }

    }

    async getNewAccessToken(req: Request, res: Response) {
        try {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.log("Trace ID for get-new-access-token request:", traceId); // Debugging line to check the generated trace ID
            const schema = z.object({
                refreshToken: z.string(),
            })

            const validation = schema.parse(req.body);

            const tokens = await this.application.getNewAccessToken(validation.refreshToken);

            if (tokens) {
                res.status(200).json(tokens);
            } else {
                res.status(401).json({ message: "Invalid refresh token" });
            }
        } catch (error) {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.error("Trace ID for get-new-access-token request:", traceId); // Debugging line to check the generated trace ID
            res.status(500).json({ message: "Error forwarding request to patient service", error });
        }

    }

}