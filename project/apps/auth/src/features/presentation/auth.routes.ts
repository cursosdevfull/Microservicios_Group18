import { Router } from "express";
import axios from "axios";
import { env } from "@core/index";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Auth API!" });
        });

        this.router.post("/auth/login", async (req, res) => {
            console.log("Received login request:", req.body); // Debugging line to check the incoming request body
            try {
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/patient`)
                const patientLoginUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/patient/login`
                const response = await axios.post(patientLoginUrl, req.body);
                res.json(response.data);
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Error forwarding request to auth service", error });
            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();