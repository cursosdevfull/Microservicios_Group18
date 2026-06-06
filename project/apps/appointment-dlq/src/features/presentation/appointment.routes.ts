import { Router } from "express";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Appointment DLQ Service!" });
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();