import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "patient" })
export class PatientEntity {
    @PrimaryGeneratedColumn()
    patientId!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 100 })
    lastname!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "varchar", length: 2 })
    countryISO!: string;

    @Column({ type: "varchar", length: 50 })
    refreshToken!: string
}