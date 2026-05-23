import { Router } from "express";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Appointment CL API!" });
        });

        this.router.post("/appointment", (req, res) => {
            res.status(200).json({ message: "Appointment CL endpoint hit!" })
        })        
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();