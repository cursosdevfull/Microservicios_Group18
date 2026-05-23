import { ServiceStatus, TServiceInstance, TServiceRegistry } from "./registry-type";
import crypto from "crypto";

export class Registry {
    private services: Map<string, TServiceRegistry> = new Map();

    register(registry: TServiceRegistry) {
        const service: TServiceInstance = {
            id: crypto.randomUUID(),
            name: registry.name,
            host: registry.host,
            port: registry.port,
            healthCheckUrl: registry.healthCheckUrl,
            lastHeartbeat: new Date(),
            status: ServiceStatus.UNKNOWN
        }

        this.services.set(service.name, service)

        console.log("Services registered in the registry:", Array.from(this.services.keys()));
        //console.log(`Service registered: ${service.name} at ${service.host}:${service.port}`);

        return service
    }

    getServiceByName(name: string) {
        return this.services.get(name) || null
    }

    processHeartbeat(id: string) {
        for (const service of this.services.values()) {
            if (service.id === id) {
                service.lastHeartbeat = new Date()
                service.status = ServiceStatus.HEALTHY
                console.log(`Received heartbeat from service: ${service.name} at ${service.host}:${service.port}`);
                return true
            }
        }
        return false
    }

    async processHealthCheck() {
        const statusHealthCheck = []

        for (const service of this.services.values()) {
            try {
                const response = await fetch(service.healthCheckUrl)
                if (!response.ok) {
                    statusHealthCheck.push({ name: service.name, status: ServiceStatus.UNHEALTHY, timestamp: new Date() })
                } else {
                    statusHealthCheck.push({ name: service.name, status: ServiceStatus.HEALTHY, timestamp: new Date() })
                }
            } catch (error) {
                statusHealthCheck.push({ name: service.name, status: ServiceStatus.UNHEALTHY, timestamp: new Date() })
            }
        }

        return statusHealthCheck
    }

    async removeUnhealthyServices(timeout: number) {
        setInterval(() => {
            console.log("Checking for unhealthy services...")
            const now = new Date()
            for (const [name, service] of this.services.entries()) {
                this.changeStatusService(name, service, timeout, now)
            }
        }, 30000)
    }

    getStats() {
        const services = Array.from(this.services.values())
        const totalServices = services.length
        const healthyServices = services.filter(service => service.status === ServiceStatus.HEALTHY).length
        const unhealthyServices = services.filter(service => service.status === ServiceStatus.UNHEALTHY).length
        const unknownServices = services.filter(service => service.status === ServiceStatus.UNKNOWN).length

        return {
            total: totalServices,
            healthy: healthyServices,
            unhealthy: unhealthyServices,
            unknown: unknownServices,
            servicesByName: services.reduce((acc, service) => {
                acc[service.name] = (acc[service.name] || 0) + 1
                return acc
            }, {} as Record<string, number>)
        }
    }

    private changeStatusService(name: string, service: TServiceRegistry, timeout: number, now: Date) {
        const removeService = () => {
            this.services.delete(name);
            console.log(`Removed unhealthy service: ${service.name} at ${service.host}:${service.port}`);
        };

        const markUnhealthy = () => {
            service.status = ServiceStatus.UNHEALTHY;
            console.log(`Marked service as unhealthy: ${service.name} at ${service.host}:${service.port}`);
        };

        if (!service.lastHeartbeat) {
            service.status === ServiceStatus.UNHEALTHY ? removeService() : markUnhealthy();
        } else {
            const timeDiff = now.getTime() - service.lastHeartbeat.getTime();
            if (timeDiff > timeout) {
                service.status === ServiceStatus.UNHEALTHY ? removeService() : markUnhealthy();
            }
        }
    }
}