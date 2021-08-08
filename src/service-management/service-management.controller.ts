import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Pageable } from 'nestjs-pager';
import { DeleteResult } from 'typeorm';
import { ServiceManagementService } from './service-management.service';
import { Service } from './service.entity';

@Controller('services')
export class ServiceManagementController {
    constructor(private serviceManagementService: ServiceManagementService) {}

    @Post()
    public createService(@Body() service: Service) {
        return this.serviceManagementService.createService(service);
    }

    @Put(":serviceId")
    public updateService(@Param('serviceId') serviceId: string, @Body() service: Service) {
        return this.serviceManagementService.updateService(serviceId, service);
    }

    @Delete(":serviceId")
    public deleteService(@Param('serviceId') serviceId: string): Promise<DeleteResult> {
        return this.serviceManagementService.deleteService(serviceId);
    }
    
    @Get(":serviceId")
    public async getService(@Param('serviceId') serviceId: string): Promise<Service> {   
        const service: Service = await this.serviceManagementService.findById(serviceId);
        if(!service) throw new NotFoundException("Service not found");
        return service;
    }

    @Get()
    public listServices(@Pageable() pageable: Pageable) {
        return this.serviceManagementService.listAll(pageable);
    }

    @Get("/regenerate/:serviceId")
    public async regenerateCredentials(@Param('serviceId') serviceId: string): Promise<Service> {   
        return this.serviceManagementService.regenerateCredentials(serviceId);
    }
}
