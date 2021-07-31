import { generateClientId, generateClientSecret } from "src/utils/randomUtil";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("services")
export class Service {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false, unique: true })
    public title: string;

    @Column({ nullable: false, default: generateClientId() })
    public clientId: string;

    @Column({ nullable: false, default: generateClientSecret() })
    public clientSecret: string;
}