import { Patient } from "@domain";

export type ApplicationPort = {
    create(patient: Patient): Promise<void>;
    findByEmail(email: string): Promise<Patient | null>;
    login(email: string, password: string): Promise<boolean>;
}