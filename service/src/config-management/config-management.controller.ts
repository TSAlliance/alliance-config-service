import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Pageable } from 'nestjs-pager';
import { ConfigManagementService } from './config-management.service';
import { Config, ConfigBody } from './config.entity';

@Controller()
export class ConfigManagementController {
    constructor(private configService: ConfigManagementService) {}

    @Get(":serviceId")
    public async listConfigsOfService(@Param("serviceId") serviceId: string, @Pageable() pageable: Pageable) {
        return await this.configService.listAllOfService(serviceId, pageable);
    }

    @Get(":serviceId/:configId")
    public async getConfig(@Param("serviceId") serviceId: string, @Param("configId") configId: string) {
        const config: Config = await this.configService.findConfigByServiceAndConfigId(serviceId, configId);
        if(!config) throw new NotFoundException();
        return config;
    }

    @Post(":serviceId")
    public registerConfig(@Param("serviceId") serviceId: string, @Body() config: ConfigBody) {
        return this.configService.setConfig(serviceId, config);
    }

    @Put(":serviceId/:configId")
    public updateConfig(@Param("serviceId") serviceId: string, @Param("configId") configId: string, @Body() config: ConfigBody) {
        return this.configService.updateConfig(serviceId, configId, config);
    }

}
