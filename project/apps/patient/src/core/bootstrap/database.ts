import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "..";
import { PatientEntity } from "@adapters";

export class Database {
    static dataSource: DataSource

    public initialize() {
        return new Promise(async (resolve, reject) => {
            const options: DataSourceOptions = {
                type: "mysql",
                host: env.DB_HOST,
                port: env.DB_PORT,
                username: env.DB_USER,
                password: env.DB_PASSWORD,
                database: env.DB_NAME,
                synchronize: env.DB_SYNCHRONIZE,
                logging: env.DB_LOGGING,
                poolSize: env.DB_POOL_SIZE,
                entities: [PatientEntity],
            }

            try {
                const app = new DataSource(options);
                await app.initialize();
                Database.dataSource = app;
                console.log("Database connection established successfully.");
                resolve("Database initialized");
            } catch (error) {
                console.error("Error initializing the database:", error);
                reject("Database initialization failed");
            }

        })
    }
}