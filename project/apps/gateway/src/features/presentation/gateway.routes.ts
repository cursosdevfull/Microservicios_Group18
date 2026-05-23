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
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();