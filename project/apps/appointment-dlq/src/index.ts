import "./core/index"

import { app } from "./app"
import { Server } from "@core/bootstrap"
import { Discovery } from "@core/services/discovery"
import { KafkaConsumer, RabbimqConsumer } from "@core/services"
import { env } from "./core"
import { ExchangeType } from "@core/types"

(async () => {
  try {
    const server = new Server(app)

    const process = [server.initialize()]

    await Promise.all(process)

    const discovery = new Discovery()
    await discovery.registerService()
    discovery.sendHeartbeat()

    const consumer = new KafkaConsumer()
    consumer.consume(env.GROUP_ID, env.TOPIC_CONSUME, async (message) => {
      console.log("================================");
      console.log("Received message DLQ desde Kafka:", message);
    })

/*     const consumer = new RabbimqConsumer()
    await consumer.connect();
    await consumer.configureExchange(env.EXCHANGE_NAME, env.EXCHANGE_TYPE as ExchangeType);
    await consumer.configureQueue(env.QUEUE_NAME, env.ROUTING_KEY, { durable: true });
    await consumer.consumer(env.QUEUE_NAME, (message) => {
      console.log("================================");
      console.log("Received message DLQ:", message);
    }); */
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


