import { Router } from "express";
import axios from "axios"
import { env } from "@core/environment";
import crypto from "crypto";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the API Gateway!" });
        });

        this.router.post("/appointment", async (req, res) => {
            try {
                const traceId = crypto.randomUUID();
                console.log("Trace ID for appointment request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/enrich`)
                const enrichUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/enrich`
                const response = await axios.post(enrichUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to enrich service", error });
            }
        });

        this.router.post("/patient", async (req, res) => {
            try {
                const traceId = crypto.randomUUID();
                console.log("Trace ID for patient request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/patient`)
                const patientUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/patient`
                const response = await axios.post(patientUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to patient service", error });
            }
        });

        this.router.post("/auth/login", async (req, res) => {
            try {
                const traceId = crypto.randomUUID();
                console.log("Trace ID for auth login request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/auth`)
                const authUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/auth/login`
                console.log("Auth URL:", authUrl); // Debugging line to check the constructed URL
                const response = await axios.post(authUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to auth service", error });
            }
        })

        this.router.post("/auth/get-new-access-token", async (req, res) => {
            try {
                const traceId = crypto.randomUUID();
                console.log("Trace ID for get-new-access-token request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/auth`)
                const authUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/auth/get-new-access-token`
                console.log("Auth URL:", authUrl); // Debugging line to check the constructed URL
                const response = await axios.post(authUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to auth service", error });
            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();