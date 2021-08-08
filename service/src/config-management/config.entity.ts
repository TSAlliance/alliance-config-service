import { Service } from "src/service-management/service.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("configs")
export class Config {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @OneToOne(() => Service, () => (service) => service.config, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn()
    public service: Service;

    @Column({ type: "json", nullable: false })
    public scheme: any;

    @Column({ default: 1 })
    public version: number;

    @Column({ nullable: true })
    public lastFetched?: Date;
}