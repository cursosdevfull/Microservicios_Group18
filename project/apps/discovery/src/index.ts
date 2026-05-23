import "./core/index"

import {app} from "./app"
import { Server } from "@core/bootstrap"

(async () => {
  try {
    const server = new Server(app)

    const process = [server.initialize()]

    await Promise.all(process)
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


