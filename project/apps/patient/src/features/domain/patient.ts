export type COUNTRY_ISO = "CL" | "CO" | "PE"

export type PatientMandatoryFields = {
    name: string;
    lastname: string;
    email: string;
    password: string;
    countryISO: COUNTRY_ISO;
}

export type PatientOptionalFields = {
    patientId: number;
    refreshToken: string;
}

export type PatientFields = PatientMandatoryFields & Partial<PatientOptionalFields>;

export type PatientUpdateFields = Partial<PatientMandatoryFields>

export class Patient {
    private readonly patientId?: number;
    private name: string;
    private lastname: string;
    private email: string;
    private password: string;
    private countryISO: COUNTRY_ISO;
    private refreshToken?: string;

    constructor(fields: PatientFields) {
        if (fields.patientId) this.patientId = fields.patientId;

        if (fields.name.trim().length < 3) throw new Error("Name must be at least 3 characters long");
        if (fields.lastname.trim().length < 3) throw new Error("Lastname must be at least 3 characters long");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw new Error("Invalid email format");

        this.name = fields.name;
        this.lastname = fields.lastname;
        this.email = fields.email;
        this.password = fields.password;
        this.countryISO = fields.countryISO;

        if (fields.refreshToken) this.refreshToken = fields.refreshToken;
    }

    get properties(): PatientFields {
        const result: PatientFields = {
            name: this.name,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            countryISO: this.countryISO,
        };
        if (this.patientId) {
            result.patientId = this.patientId;
        }
        if (this.refreshToken) {
            result.refreshToken = this.refreshToken;
        }

        return result;
    }

    update(fields: PatientUpdateFields) {
        if (fields.name && fields.name.trim().length < 3) throw new Error("Name must be at least 3 characters long");
        if (fields.lastname && fields.lastname.trim().length < 3) throw new Error("Lastname must be at least 3 characters long");
        if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw new Error("Invalid email format");

        Object.assign(this, fields);
    }
}