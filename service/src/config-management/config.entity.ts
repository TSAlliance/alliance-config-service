import { Service } from "src/service-management/service.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("configs")
export class Config implements ConfigBody {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ length: 120, nullable: true })
    public description: string;

    @ManyToOne(() => Service, () => (service) => service.configs, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn()
    public service: Service;

    @Column({ type: "json", nullable: false })
    public schema: Record<string, any>;

    @Column({ default: 1 })
    public version: number;

    @BeforeInsert()
    public populateSchema() {
        this.schema = {}
    }
}

export interface ConfigBody {
    description: string;
    schema: Record<string, any>;
}