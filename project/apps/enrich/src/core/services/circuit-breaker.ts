type CircuitState = 'closed' | 'open' | 'half-open';

export class CircuitBreakerOpenError extends Error {
    constructor(serviceName: string, retryAfter: number) {
        super(`Circuit breaker for service "${serviceName}" is open. Retry after ${retryAfter} ms.`);
        this.name = 'CircuitBreakerOpenError';
    }
}

interface CircuitBreakerOptions {
    serviceName: string;
    failureThreshold?: number;
    recoveryTimeout?: number;
    requestTimeout?: number;
    halfOpenSuccessThreshold?: number;
}

export class CircuitBreaker {
    private state: CircuitState = 'closed';
    private failureCount: number = 0;
    private halfOpenSuccess: number = 0;
    private nextAttemptAt: number = 0;

    private readonly serviceName: string;
    private readonly failureThreshold: number;
    private readonly recoveryTimeout: number;
    private readonly requestTimeout: number;
    private readonly halfOpenSuccessThreshold: number;

    constructor(options: CircuitBreakerOptions) {
        this.serviceName = options.serviceName;
        this.failureThreshold = options.failureThreshold ?? 3;
        this.recoveryTimeout = options.recoveryTimeout ?? 10000;
        this.requestTimeout = options.requestTimeout ?? 3000;
        this.halfOpenSuccessThreshold = options.halfOpenSuccessThreshold ?? 1;
    }

    async execute<T>(operation: () => Promise<T>): Promise<any> {
        const now = Date.now();

        console.log("===============================")
        console.log("state", this.state)

        if (this.state === "open") {
            console.log(`Now = ${now}, Next Attempt At = ${this.nextAttemptAt}`);
            if (now < this.nextAttemptAt) {
                throw new CircuitBreakerOpenError(this.serviceName, this.nextAttemptAt - now);
            }
            this.logTransition(this.state, "half-open", "Recovery window elapsed");
            this.state = "half-open";
            this.halfOpenSuccess = 0;
        }

        try {
            const result = await this.runWithTimeout(operation);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private async runWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
        let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

        try {
            return await Promise.race([
                operation(),
                new Promise<never>((_, reject) => {
                    timeoutHandle = setTimeout(() => {
                        reject(new Error(`Operation timed out after ${this.requestTimeout} ms`));
                    }, this.requestTimeout);
                })
            ])
        } finally {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }
        }
    }

    private onSuccess(): void {
        if (this.state === 'half-open') {
            this.halfOpenSuccess++;
            if (this.halfOpenSuccess >= this.halfOpenSuccessThreshold) {
                this.reset()
            }
            return;
        }

        this.failureCount = 0;
    }

    private onFailure(): void {
        if (this.state === "half-open") {
            this.open();
            return;
        }

        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.open();
        }
    }

    private open(): void {
        const previousState = this.state;
        this.state = "open";
        this.nextAttemptAt = Date.now() + this.recoveryTimeout;
        this.logTransition(previousState, this.state, `Failure threshold reached (${this.failureCount}/${this.failureThreshold})`);
    }


    private reset(): void {
        const previousState = this.state;
        this.state = 'closed';
        this.failureCount = 0;
        this.halfOpenSuccess = 0;
        this.nextAttemptAt = 0;
        this.logTransition(previousState, this.state, "Service recovered");
    }

    private logTransition(from: CircuitState, to: CircuitState, reason: string): void {
        if (from === to) return;
        console.log(`[CircuitBreaker] Transition from ${from} to ${to} for service "${this.serviceName}". Reason: ${reason}`);
        console.log(`State: ${this.state}, Failure Count: ${this.failureCount}, Half-Open Success: ${this.halfOpenSuccess}`);
    }

}