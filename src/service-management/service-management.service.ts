import { Injectable } from '@nestjs/common';
import { Page, Pageable } from 'nestjs-pager';
import { Service } from './service.entity';
import ServiceRepository from './service.repository';

@Injectable()
export class ServiceManagementService {
    constructor(private serviceRepository: ServiceRepository){}

    // Create new validation package -> @tsalliance/validation
    // Should work for both node and fe

    // Nest-specific:
    // Should support dependency injection, to inject in class in nestjs
    // Should have per request scope, so that every request has its own validator

    // FE-specific:
    // Validator should have constructor to be called on every validation, so this would replace nest's
    // per request scope

    public createService(service: Service): Promise<Service> {
        return this.serviceRepository.save(service);
    }
    public listAll(pageable: Pageable): Promise<Page<Service>> {
        return this.serviceRepository.findAll(pageable);
    }

}
