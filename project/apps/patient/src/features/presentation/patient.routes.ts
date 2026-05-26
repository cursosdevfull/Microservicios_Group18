import { Router } from "express";
import { PatientController } from "./patient.controller";
import { PatientApplication } from "@application/patient";
import { PatientAdapter } from "@adapters";

class Routes {
    private readonly router: Router

    constructor(controller: PatientController) {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Patient API!" });
        });

        this.router.post("/patient", controller.create.bind(controller));
        this.router.post("/patient/login", controller.login.bind(controller));
        this.router.post("/patient/get-new-access-token", controller.getNewAccessToken.bind(controller));

    }

    public getRouter(): Router {
        return this.router;
    }
}

const port = new PatientAdapter()
const application = new PatientApplication(port)
const controller = new PatientController(application)

export const router = new Routes(controller).getRouter();