import { COUNTRY_ISO, Patient } from "@domain";
import { ApplicationPort } from "../domain/ports";
import { Database } from "@core/bootstrap";
import { PatientEntity } from "@adapters";
import { comparePassword } from "@core/services/hash";

export class PatientAdapter implements ApplicationPort {
    async create(patient: Patient): Promise<void> {
        const repository = Database.dataSource.getRepository(PatientEntity)

        const modelData = new PatientEntity();
        Object.assign(modelData, patient.properties);

        await repository.save(modelData)
    }

    async findByEmail(email: string): Promise<Patient | null> {
        const repository = Database.dataSource.getRepository(PatientEntity)

        const patientEntity = await repository.findOneBy({ email });

        if (!patientEntity) {
            return null;
        }

        const props = {
            patientId: patientEntity.patientId,
            name: patientEntity.name,
            lastname: patientEntity.lastname,
            email: patientEntity.email,
            password: patientEntity.password,
            countryISO: patientEntity.countryISO as COUNTRY_ISO,
        }
        return new Patient(props);
    }

    async login(email: string, password: string): Promise<boolean> {
        const patient = await this.findByEmail(email);

        if (!patient) {
            return false
        }

        const isPasswordValid = await comparePassword(password, patient.properties.password);
        if (!isPasswordValid) {
            return false
        }

        return true;
    }

}