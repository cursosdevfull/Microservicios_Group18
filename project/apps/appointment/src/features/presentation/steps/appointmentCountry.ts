import axios from "axios";
import { IStep } from "../../../core/services/step";

export class AppointmentCountryStep implements IStep {
    readonly name = "AppointmentCountryStep";
    private readonly urlExecution: string;
    private readonly urlCompensation: string
    private readonly body: Record<string, any>
    private readonly traceId: string | string[]

    constructor(urlExecution: string, urlCompensation: string, body: Record<string, any>, traceId: string | string[]) {
        this.urlExecution = urlExecution;
        this.urlCompensation = urlCompensation;
        this.body = body;
        this.traceId = traceId;
    }

    async execute() {
        return axios.post(this.urlExecution, this.body, { headers: { "x-trace-id": this.traceId } });
    }

    async compensate() {
        return axios.post(this.urlCompensation, this.body, { headers: { "x-trace-id": this.traceId } });
    }
}
