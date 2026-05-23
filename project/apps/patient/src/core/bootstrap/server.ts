import express from 'express';
import http from 'http';
import { env } from '../environment';

export class Server {
    private readonly app: express.Application;

    constructor(app: express.Application) {
        this.app = app
    }

    public initialize() {
        return new Promise<void>((resolve, reject) => {
            const PORT = env.PORT

            const server = http.createServer(this.app)

            server
                .on("listening", () => {
                    console.log(`Patient is running on port ${PORT}`);
                    resolve();
                })
                .on("error", (err) => {
                    console.error("Error starting the server:", err);
                    reject(err);
                })
                .listen(PORT);
        })

    }
}