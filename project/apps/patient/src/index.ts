import "./core/index"

import { app } from "./app"
import { Database, Server } from "@core/bootstrap"
import { Discovery } from "@core/services/discovery"

(async () => {
  try {
    const server = new Server(app)
    const database = new Database()

    const process = [server.initialize(), database.initialize()]

    await Promise.all(process)

    const discovery = new Discovery()
    await discovery.registerService()
    discovery.sendHeartbeat()
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1)
  }
})()

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1)
})

process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  process.exit(0)
})

process.on("exit", code => console.log(`Process exiting with code: ${code}`))


