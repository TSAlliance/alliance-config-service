import { EntityRepository } from "typeorm";
import { Service } from "./service.entity";
import { PageableRepository } from "nestjs-pager"

@EntityRepository(Service)
export default class ServiceRepository extends PageableRepository<Service> {
    
}