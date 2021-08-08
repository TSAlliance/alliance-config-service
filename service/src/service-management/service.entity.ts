import { Config } from "src/config-management/config.entity";
import { generateClientId, generateClientSecret } from "src/utils/randomUtil";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("services")
export class Service {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false, unique: true })
    public title: string;

    @Column({ unique: true, nullable: false, default: generateClientId() })
    public clientId: string = generateClientId();

    @Column({ unique: true, nullable: false, default: generateClientSecret() })
    public clientSecret: string = generateClientSecret();

    @OneToOne(() => Config, () => (config) => config.service)
    public config?: Config;
}