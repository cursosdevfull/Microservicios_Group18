import { Router } from "express";
import axios from "axios"
import { env } from "@core/environment";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the API Gateway!" });
        });

        this.router.post("/appointment", async (req, res) => {
            try {
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/enrich`)
                const enrichUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/enrich`
                const response = await axios.post(enrichUrl, req.body);
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to enrich service", error });
            }
        });

        this.router.post("/patient", async (req, res) => {
            try {
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/patient`)
                const patientUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/patient`
                const response = await axios.post(patientUrl, req.body);
                res.json(response.data);
            } catch (error) {
                res.status(500).json({ message: "Error forwarding request to patient service", error });
            }
        });

        this.router.post("/auth/login", async (req, res) => {
            try {
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/auth`)
                const authUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/auth/login`
                console.log("Auth URL:", authUrl); // Debugging line to check the constructed URL
                const response = await axios.post(authUrl, req.body);
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