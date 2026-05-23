import express from "express";
import cors from "cors";
import { router } from "./features/presentation/gateway.routes";

class App {
    private app: express.Application;

    constructor() {
        this.app = express()

        this.setupMiddlewares()
        this.setupRoot()
        this.handleHealthCheck()
        this.handleRoutes()
    }

    private setupRoot() {
        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.status(200).json({ message: "Welcome to the API Gateway" })
        })
    }

    private setupMiddlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
    }

    private handleHealthCheck() {
        const healthCheckMiddleware = (req: express.Request, res: express.Response) => {
            res.status(200).json({ status: "ok" })
        }

        this.app.get("/healthcheck",healthCheckMiddleware)
        this.app.get("/health", healthCheckMiddleware)
    }

    private handleRoutes() {
        this.app.use("/api/v1", router)
    }

    get application() {
        return this.app
    }
}

export const app = new App().application