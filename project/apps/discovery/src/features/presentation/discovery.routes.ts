import { Router } from "express";
import { z } from "zod";
import { Registry } from "@core/services";

export class Routes {
    private readonly router: Router

    constructor(private readonly registry: Registry) {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Discovery API!" });
        });

        this.router.post("/register", async (req, res) => {
            try {
                const schema = z.object({
                    name: z.string().min(3),
                    host: z.string().min(3),
                    port: z.number().int().positive().max(65535),
                    healthCheckUrl: z.string().min(3)
                })

                const validatedData = schema.parse(req.body)

                const { name, host, port, healthCheckUrl } = validatedData
                const serviceRegistry = this.registry.register({
                    name,
                    host,
                    port,
                    healthCheckUrl
                })

                console.log(`Service registered: ${serviceRegistry.name} at ${serviceRegistry.host}:${serviceRegistry.port}`);

                res.status(200).json(serviceRegistry)

                //console.log(`Registering service: ${name} at ${serviceUrl} with health check at ${healthCheckUrl}`);
            } catch (error) {
                console.error("Error registering service:", error);
                res.status(500).json({ message: "Failed to register service" });
            }

        })

        this.router.get("/services/name/:name", (req, res) => {
            try {
                const schema = z.object({
                    name: z.string().min(3)
                })

                const validateData = schema.parse(req.params)

                const service = this.registry.getServiceByName(validateData.name)

                if (!service) {
                    return res.status(404).json({ message: "Service not found" })
                }

                res.status(200).json(service)
            } catch (error) {
                console.error("Error fetching service:", error);
                res.status(500).json({ message: "Failed to fetch service" });
            }
        })

        this.router.put("/services/:id/heartbeat", (req, res) => {
            try {
                const schema = z.object({
                    id: z.uuidv4()
                })

                const validateData = schema.parse(req.params)

                const successOrFailure = this.registry.processHeartbeat(validateData.id)



            } catch (error) {
                console.error("Error processing heartbeat:", error);
                res.status(500).json({ message: "Failed to process heartbeat" });
            }
            // Implement heartbeat logic here
            res.status(200).json({ message: "Heartbeat received" });
        })

        this.router.get("/services/healthcheck", async (req, res) => {
            try {
                const healthCheckResults = await this.registry.processHealthCheck()
                res.status(200).json(healthCheckResults)
            } catch (error) {
                console.error("Error processing health check:", error);
                res.status(500).json({ message: "Failed to process health check" });
            }
        })

        this.router.get("/services/stats", (req, res) => {
            try {
                const stats = this.registry.getStats()
                res.status(200).json(stats)
            } catch (error) {
                console.error("Error fetching service stats:", error);
                res.status(500).json({ message: "Failed to fetch service stats" });
            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}