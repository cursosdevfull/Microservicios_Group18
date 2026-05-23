import { PatientApplication } from "@application/patient";
import { Request, Response } from "express";
import { z } from "zod";
import { Patient } from "../domain/patient";
import { hashPassword } from "@core/services/hash";

export class PatientController {
    constructor(private application: PatientApplication) { }

    async create(req: Request, res: Response) {
        try {
            const schema = z.object({
                name: z.string(),
                lastname: z.string(),
                email: z.string(),
                password: z.string(),
                countryISO: z.enum(["CL", "CO", "PE"]),
            })

            const validation = schema.parse(req.body);

            const patient = new Patient({ ...validation, password: await hashPassword(validation.password) });

            await this.application.create(patient)

            res.status(201).json({ message: "Patient created successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Error forwarding request to patient service", error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const schema = z.object({
                email: z.string(),
                password: z.string(),
            })

            const validation = schema.parse(req.body);

            const isLoginSuccessful = await this.application.login(validation.email, validation.password);

            if (isLoginSuccessful) {
                res.status(200).json({ message: "Login successful!" });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error forwarding request to patient service", error });
        }

    }


}