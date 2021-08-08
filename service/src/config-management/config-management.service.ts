import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Pageable } from 'nestjs-pager';
import { ServiceManagementService } from 'src/service-management/service-management.service';
import { Service } from 'src/service-management/service.entity';
import ConfigRepository from './config-management.repository';
import { Config } from './config.entity';

@Injectable()
export class ConfigManagementService {
    constructor(private configRepository: ConfigRepository, private serviceManagementService: ServiceManagementService) {}

    public async findConfigByServiceId(serviceId: string): Promise<Config> {

        // Update last fetched, if it was fetched by service itself

        return this.configRepository.findOne({ service: { id: serviceId }}, { relations: ["service"] });
    }

    public async listAll(pageable: Pageable): Promise<Page<Config>> {
        return this.configRepository.findAll(pageable, { relations: ["service"] });
    }

    public async setConfig(serviceId: string, config: Record<string, any>): Promise<Config> {
        const service: Service = await this.serviceManagementService.findById(serviceId);
        if(!service) throw new NotFoundException();

        let cfg = await this.findConfigByServiceId(service.id);
        if(!cfg) {
            cfg = new Config();
            cfg.service = service;
        }

        cfg.scheme = config;

        return this.configRepository.save(cfg);
    }

    public async saveConfig(config: Config): Promise<Config> {
        return this.configRepository.save(config);
    }

    public async updateConfig(serviceId: string, config: Record<string, any>): Promise<Config> {
        const service: Service = await this.serviceManagementService.findById(serviceId);
        if(!service) throw new NotFoundException();

        let cfg = await this.findConfigByServiceId(service.id);
        if(!cfg) {
            cfg = new Config();
            cfg.service = service;
        } else {
            cfg.scheme = {
                ...cfg.scheme,
                ...config
            }
        }

        return this.configRepository.save(cfg);
    }

}
