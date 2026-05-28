import { CircuitBreaker, CircuitBreakerOpenError } from "./circuit-breaker";

const circuitBreaker = new CircuitBreaker(
    {
        serviceName: "ExampleService",
        failureThreshold: 3,
        recoveryTimeout: 5000,
        requestTimeout: 4000,
        halfOpenSuccessThreshold: 1
    }
);

const testOperation = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.5) {
                resolve("Success");
            } else {
                reject(new Error("Random failure"));
            }
        }, 800)
    })
}

setInterval(async () => {
    try {
        const result = await circuitBreaker.execute(testOperation);
        console.log("Operation result:", result);
    } catch (error) {
        if (error instanceof CircuitBreakerOpenError) {
            console.log(`Circuit breaker is open. Skipping operation.: ${error.message}`);
        } else {
            console.error("Operation failed:", error);
        }
    }
}, 1000)