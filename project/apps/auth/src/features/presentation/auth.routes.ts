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
                console.log("Headers of the incoming request:", req.headers); // Debugging line to check the incoming request headers
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.log("Trace ID for auth login request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/patient`)
                const patientLoginUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/patient/login`
                const response = await axios.post(patientLoginUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Error forwarding request to auth service", error });
            }
        })

        this.router.post("/auth/get-new-access-token", async (req, res) => {
            console.log("Received get-new-access-token request:", req.body); // Debugging line to check the incoming request body
            try {
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.log("Trace ID for get-new-access-token request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/patient`)
                const patientGetNewAccessTokenUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/patient/get-new-access-token`
                const response = await axios.post(patientGetNewAccessTokenUrl, req.body, { headers: { "x-trace-id": traceId } });
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