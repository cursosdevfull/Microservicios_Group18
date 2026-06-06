import { env } from "@core/environment";
import axios from "axios";

export class Discovery {
    private readonly discoveryUrl: string = env.API_DISCOVERY_URL
    private readonly name: string = env.NAME
    private readonly host: string = env.HOST
    private readonly port: number = env.PORT
    static instanceId: string

    async registerService() {
        try {
            const serviceInfo = {
                name: this.name,
                host: this.host,
                port: this.port,
                healthCheckUrl: `${this.host}:${this.port}/healthcheck`
            }

            const response = await axios.post(`${this.discoveryUrl}/register`, serviceInfo)
            Discovery.instanceId = response.data.id
            console.log(`Registering service: ${this.name} at ${this.host}:${this.port}`);
        } catch (error) {
            console.error(`Failed to register service: ${this.name}`, error);
        }
    }

    async sendHeartbeat() {
        setInterval(async () => {
            try {
                if (!Discovery.instanceId) {
                    console.warn("Service instance ID is not set. Cannot send heartbeat.");
                    return
                }
                await axios.put(`${this.discoveryUrl}/services/${Discovery.instanceId}/heartbeat`);
                console.log(`Sending heartbeat for service: ${this.name}`);
            } catch (error) {
                console.error(`Failed to send heartbeat for service: ${this.name}`, error);
            }
        }, env.INTERVAL_HEARTBEAT)
    }
}