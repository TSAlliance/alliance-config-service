import { Injectable, NotFoundException } from '@nestjs/common';
import { Validator } from '@tsalliance/rest';
import { Page, Pageable } from 'nestjs-pager';
import { ServiceManagementService } from 'src/service-management/service-management.service';
import { Service } from 'src/service-management/service.entity';
import ConfigRepository from './config-management.repository';
import { Config, ConfigBody } from './config.entity';

@Injectable()
export class ConfigManagementService {
    constructor(private configRepository: ConfigRepository, private serviceManagementService: ServiceManagementService, private validator: Validator) {}

    public async findConfigByServiceAndConfigId(serviceId: string, configId: string): Promise<Config> {
        return this.configRepository.findOne({ service: { id: serviceId }, id: configId}, { relations: ["service"] });
    }

    public async findById(configId: string): Promise<Config> {
        return this.configRepository.findOne({ id: configId}, { relations: ["service"] });
    }

    public async listAllOfService(serviceId: string, pageable: Pageable): Promise<Page<Config>> {
        return this.configRepository.findAll(pageable, { relations: ["service"], where: {service: {id: serviceId}} });
    }

    public async setConfig(serviceId: string, config: ConfigBody): Promise<Config> {
        const service: Service = await this.serviceManagementService.findById(serviceId);
        if(!service) throw new NotFoundException();

        const cfg = new Config();
        cfg.description = "New config file"
        cfg.service = service;
        cfg.schema = config.schema;

        if(this.validator.text("description", config.description).minLen(3).maxLen(120) && config.description) {
            cfg.description = config.description;
        }
        this.validator.throwErrors();

        return this.configRepository.save(cfg);
    }

    public async updateConfig(serviceId: string, configId: string, config: ConfigBody): Promise<Config> {
        const service: Service = await this.serviceManagementService.findById(serviceId);
        if(!service) throw new NotFoundException();

        let cfg = await this.findById(configId);
        if(!cfg) {
            cfg = new Config();
            cfg.description = "New config file"
            cfg.service = service;
            cfg.schema = config.schema;
        } else {
            cfg.schema = {
                ...cfg.schema,
                ...config.schema
            }
        }

        if(this.validator.text("description", config.description).minLen(3).maxLen(120) && config.description) {
            cfg.description = config.description;
        }
        this.validator.throwErrors();

        return this.configRepository.save(cfg);
    }

    public async saveConfig(config: Config): Promise<Config> {
        return this.configRepository.save(config);
    }

}
