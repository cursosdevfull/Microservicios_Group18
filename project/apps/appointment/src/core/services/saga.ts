import { IStep } from "./step";

export class SagaOrchestrator {
    private steps: IStep[]
    private executedSteps: IStep[]

    constructor(steps: IStep[]) {
        this.steps = steps;
        this.executedSteps = [];
    }

    public async execute() {
        for (const step of this.steps) {
            try {
                console.log(`Executing step: ${step.name}`);
                await step.execute();
                this.executedSteps.push(step);
            } catch (error) {
                await this.compensate();
                throw error; // Rethrow the error after compensation
            }
        }
    }

    public async compensate() {
        for (const step of this.executedSteps.reverse()) {
            await step.compensate();
        }
    }
}