import { Router } from "express";
import axios from "axios";
import { env } from "@core/index";
import { CircuitBreaker, CircuitBreakerOpenError } from "@core/services";

const enrichBreaker = new CircuitBreaker({
    serviceName: "enrich-service",
    failureThreshold: 3,
    recoveryTimeout: 10000,
    requestTimeout: 4000,
    halfOpenSuccessThreshold: 1,
})

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Enrich API!" });
        });

        this.router.post("/enrich", async (req, res) => {
            //const countryISO = ["CO", "CL", "PE"][Math.floor(Math.random() * 3)];
            const countryISO = "CL";

            try {
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.log("Trace ID for enrich request:", traceId); // Debugging line to check the generated trace ID
                const serviceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/appointment`)
                const appointmentUrl = `${serviceFromDiscovery.data.host}:${serviceFromDiscovery.data.port}/api/v1/appointment`
                const response = await enrichBreaker.execute(() =>
                    axios.post(appointmentUrl, { ...req.body, countryISO }, { headers: { "x-trace-id": traceId } })
                );
                res.json(response.data);
            } catch (error) {
                const traceId = req.headers["x-trace-id"] || "N/A";

                if (error instanceof CircuitBreakerOpenError) {
                    console.error("Circuit breaker is open for enrich request with Trace ID:", traceId);
                    res.status(503).json({ message: "Service temporarily unavailable", error });
                } else {
                    console.error("Trace ID for enrich request:", traceId); // Debugging line to check the generated trace ID
                    res.status(500).json({ message: "Error forwarding request to appointment service", error });
                }

            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();