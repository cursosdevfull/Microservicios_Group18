import { Router } from "express";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Salesforce API!" });
        });

        this.router.post("/salesforce", (req, res) => {
            throw new Error("Simulated error in Salesforce endpoint"); // Simulate an error to test compensation
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.log("Trace ID for salesforce request:", traceId); // Debugging line to check the generated trace ID
            res.status(200).json({ message: "Salesforce endpoint hit!" })
        })

        this.router.post("/salesforce-compensation", (req, res) => {
            const traceId = req.headers["x-trace-id"] || "N/A";
            console.log("Trace ID for salesforce compensation request:", traceId); // Debugging line to check the generated trace ID
            res.status(200).json({ message: "Salesforce compensation endpoint hit!" })
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();