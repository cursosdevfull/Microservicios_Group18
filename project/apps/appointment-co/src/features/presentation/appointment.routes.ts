import { Router } from "express";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Appointment CO API!" });
        });

        this.router.post("/appointment", (req, res) => {
           //throw new Error("Simulated error for testing")
            res.status(200).json({ message: "Appointment CO endpoint hit!" })
        })        
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();