export enum ServiceStatus {
    HEALTHY = "healthy",
    UNHEALTHY = "unhealthy",
    UNKNOWN = "unknown"
}

export type TServiceInstance = {
    id?: string,
    name: string,
    host: string,
    port: number,
    healthCheckUrl: string
    lastHeartbeat?: Date
    status?: ServiceStatus
}

export type TServiceRegistry = TServiceInstance

