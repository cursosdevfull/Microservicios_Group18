import express from "express";
import cors from "cors";
import { Routes } from "./features/presentation/discovery.routes";
import { Registry } from "@core/services";

class App {
    private app: express.Application;
    private readonly registry = new Registry()

    constructor() {
        this.app = express()

        this.setupMiddlewares()
        this.setupRoot()
        this.handleHealthCheck()
        this.handleRoutes()

        this.registry.removeUnhealthyServices(15000)
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

        this.app.get("/healthcheck", healthCheckMiddleware)
        this.app.get("/health", healthCheckMiddleware)
    }

    private handleRoutes() {
        const routes = new Routes(this.registry)
        this.app.use("/api/v1", routes.getRouter())
    }

    get application() {
        return this.app
    }
}

export const app = new App().application