import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Pageable } from 'nestjs-pager';
import { ServiceManagementService } from './service-management.service';
import { Service } from './service.entity';

@Controller('services')
export class ServiceManagementController {
    constructor(private serviceManagementService: ServiceManagementService) {}

    @Post()
    public createService(@Body() service: Service) {
        // TODO: Create services -> Return serviceSecret, serviceClientId for authentication -> Has to be defined in config client (hard-coded or per Env variable)
        // The Body should take in an interface of Service and returns an interface containing the above properties
        service.clientSecret = undefined;
        service.clientId = undefined;
        return this.serviceManagementService.createService(service);
    }

    @Put()
    public updateService(@Body() service: Service) {
        // TODO
    }

    @Delete(":serviceId")
    public deleteService(@Param() serviceId: string) {
        // TODO: Delete service
    }
    
    @Get(":serviceId")
    public getService(@Param() serviceId: string) {
        // TODO: Return the service by its id
    }

    @Get()
    public listServices(@Pageable() pageable: Pageable) {
        console.log(pageable);
        return this.serviceManagementService.listAll(pageable);
        
        // TODO: Return a list of services, maybe check if Nest.js supports pagination?
    }
}
