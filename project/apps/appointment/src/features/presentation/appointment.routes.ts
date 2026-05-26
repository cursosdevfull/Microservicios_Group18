import { Router } from "express";
import axios from "axios";
import { env } from "@core/index";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Appointment API!" });
        });

        this.router.post("/appointment", async (req, res) => {
            const { countryISO } = req.body;

            try {
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.log("Trace ID for appointment request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/appointment-${countryISO.toLowerCase()}`)
                const appointmentUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/appointment`
                const response = await axios.post(appointmentUrl, req.body, { headers: { "x-trace-id": traceId } });
                res.json(response.data);
            } catch (error) {
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.error("Trace ID for appointment request:", traceId); // Debugging line to check the generated trace ID
                res.status(500).json({ message: "Error forwarding request to appointment service", error });
            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();