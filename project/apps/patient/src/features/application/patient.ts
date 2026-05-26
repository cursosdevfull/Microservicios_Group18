import { comparePassword } from "@core/services/hash";
import { Patient, ITokens } from "../domain";
import { ApplicationPort } from "../domain/ports";
import { generateAccessToken } from "@core/services";

export class PatientApplication {
    constructor(private readonly applicationPort: ApplicationPort) { }

    public async create(patient: Patient): Promise<void> {
        await this.applicationPort.create(patient);
    }

    public async login(email: string, password: string): Promise<ITokens | null> {
        const patient = await this.applicationPort.findByEmail(email);

        if (!patient) {
            return null;
        }

        const isPasswordValid = await comparePassword(password, patient.properties.password);
        if (!isPasswordValid) {
            return null;
        }

        const { patientId, name, lastname, refreshToken } = patient.properties;

        const tokens: ITokens = {
            accessToken: generateAccessToken(patientId!, name, lastname),
            refreshToken: refreshToken!, // In a real application, you would want to generate a new refresh token and update it in the database
        };

        return tokens;
    }

    public async getNewAccessToken(rt: string): Promise<ITokens | null> {
        const patient = await this.applicationPort.findByRefreshToken(rt);

        if (!patient) {
            return null;
        }

        const { patientId, name, lastname, refreshToken } = patient.properties;

        const tokens: ITokens = {
            accessToken: generateAccessToken(patientId!, name, lastname),
            refreshToken: refreshToken!, // In a real application, you would want to generate a new refresh token and update it in the database
        };

        return tokens;
    }
}