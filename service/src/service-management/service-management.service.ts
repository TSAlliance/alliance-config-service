import { Injectable, NotFoundException } from '@nestjs/common';
import { Validator } from '@tsalliance/rest';
import { Page, Pageable } from 'nestjs-pager';
import { generateClientId, generateClientSecret } from 'src/utils/randomUtil';
import { DeleteResult } from 'typeorm';
import { Service } from './service.entity';
import ServiceRepository from './service.repository';

@Injectable()
export class ServiceManagementService {
    constructor(private serviceRepository: ServiceRepository, private validator: Validator){}

    public async createService(service: Service): Promise<Service> {
        this.validator.text("title", service.title).alphaNum().minLen(3).maxLen(32).required().check();
        this.validator.throwErrors();

        const s = new Service();
        s.title = service.title;

        return this.serviceRepository.save(s);
    }

    public async findById(id: string): Promise<Service> {
        return this.serviceRepository.findOne({ id });
    }

    public async findByIdWithRelations(id: string): Promise<Service> {
        return this.serviceRepository.findOne({ id }, { relations: ["config"] });
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
