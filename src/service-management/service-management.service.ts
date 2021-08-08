import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Pageable } from 'nestjs-pager';
import { generateClientId, generateClientSecret } from 'src/utils/randomUtil';
import { Validator } from 'src/validator/validator';
import { DeleteResult } from 'typeorm';
import { Service } from './service.entity';
import ServiceRepository from './service.repository';

@Injectable()
export class ServiceManagementService {
    constructor(private serviceRepository: ServiceRepository, private validator: Validator){}

    // Create new validation package -> @tsalliance/validation
    // Should work for both node and fe

    // Nest-specific:
    // Should support dependency injection, to inject in class in nestjs
    // Should have per request scope, so that every request has its own validator

    // FE-specific:
    // Validator should have constructor to be called on every validation, so this would replace nest's
    // per request scope

    public async createService(service: Service): Promise<Service> {
        service.clientSecret = undefined;
        service.clientId = undefined;

        this.validator.text("title", service.title).alphaNum().minLen(3).maxLen(32).required().check();
        this.validator.throwErrors();

        return this.serviceRepository.save(service);
    }

    public async findById(id: string): Promise<Service> {
        return this.serviceRepository.findOne({ id });
    }

    public async listAll(pageable: Pageable): Promise<Page<Service>> {
        return this.serviceRepository.findAll(pageable);
    }

    public async deleteService(id: string): Promise<DeleteResult> {
        return this.serviceRepository.delete({ id });
    }

    public async updateService(id: string, updated: Service): Promise<Service> {
        const service: Service = await this.findById(id);        
        if(!service) throw new NotFoundException();

        if(this.validator.text("title", updated.title).alpha().minLen(3).maxLen(32).check()) {
            if(updated.title) service.title = updated.title;
        }

        this.validator.throwErrors();
        return this.serviceRepository.save(service);
    }

    public async regenerateCredentials(id: string): Promise<Service> {
        const service: Service = await this.findById(id);        
        if(!service) throw new NotFoundException();

        service.clientId = generateClientId();
        service.clientSecret = generateClientSecret();

        return this.serviceRepository.save(service);
    }

}
