import { Injectable } from '@nestjs/common';
import { Page, Pageable } from 'nestjs-pager';
import { Service } from './service.entity';
import ServiceRepository from './service.repository';

@Injectable()
export class ServiceManagementService {
    constructor(private serviceRepository: ServiceRepository){}

    public createService(service: Service): Promise<Service> {
        return this.serviceRepository.save(service);
    }
    public listAll(pageable: Pageable): Promise<Page<Service>> {
        return this.serviceRepository.findAll(pageable);
    }

}
