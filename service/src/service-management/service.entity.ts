import { Config } from "src/config-management/config.entity";
import { generateClientId, generateClientSecret } from "src/utils/randomUtil";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("services")
export class Service {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false, unique: true })
    public title: string;

    @Column({ unique: true, nullable: false })
    public clientId: string;

    @Column({ unique: true, nullable: false })
    public clientSecret: string;

    @OneToMany(() => Config, () => (config) => config.service)
    public configs?: Config[];

    @BeforeInsert()
    public populateClientCredentials() {
        this.clientSecret = generateClientSecret();
        this.clientId = generateClientId();
    }
}