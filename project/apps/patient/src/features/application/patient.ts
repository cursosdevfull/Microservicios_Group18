import { Patient } from "../domain/patient";
import { ApplicationPort } from "../domain/ports";

export class PatientApplication {
    constructor(private readonly applicationPort: ApplicationPort) { }

    public async create(patient: Patient): Promise<void> {
        await this.applicationPort.create(patient);
    }

    public async login(email: string, password: string): Promise<boolean> {
        return await this.applicationPort.login(email, password);
    }
}