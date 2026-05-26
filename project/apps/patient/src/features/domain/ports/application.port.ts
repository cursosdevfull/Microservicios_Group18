import { Patient } from "@domain";
import { ITokens } from "../tokens";

export type ApplicationPort = {
    create(patient: Patient): Promise<void>;
    findByEmail(email: string): Promise<Patient | null>;
    findByRefreshToken(refreshToken: string): Promise<Patient | null>;
}