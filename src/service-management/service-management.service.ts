import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Pageable } from 'nestjs-pager';
import { DeleteResult } from 'typeorm';
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
        service.clientSecret = undefined;
        service.clientId = undefined;
        return this.serviceRepository.save(service);
    }

    public findById(id: string): Promise<Service> {
        return this.serviceRepository.findOne({ id });
    }

    public listAll(pageable: Pageable): Promise<Page<Service>> {
        return this.serviceRepository.findAll(pageable);
    }

    public deleteService(id: string): Promise<DeleteResult> {
        return this.serviceRepository.delete({ id });
    }

    public updateService(id: string, data: Service): Promise<Service> {
        data.clientId = undefined;
        data.clientSecret = undefined;
        data.id = id;

        return this.serviceRepository.save(data);
    }

}
