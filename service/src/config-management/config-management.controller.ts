import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Pageable } from 'nestjs-pager';
import { ConfigManagementService } from './config-management.service';
import { Config } from './config.entity';

@Controller('configs')
export class ConfigManagementController {
    constructor(private configService: ConfigManagementService) {}

    @Get(":serviceId")
    public async getConfig(@Param("serviceId") serviceId: string) {
        const config: Config = await this.configService.findConfigByServiceId(serviceId);
        console.log(config.service)
        return config;
    }

    @Get()
    public listAll(@Pageable() pageable: Pageable) {
        return this.configService.listAll(pageable);
    }

    @Post(":serviceId")
    public setConfig(@Param("serviceId") serviceId: string, @Body() config: Record<string, any>) {
        return this.configService.setConfig(serviceId, config);
    }

    @Put(":serviceId")
    public updateConfig(@Param("serviceId") serviceId: string, @Body() config: Record<string, any>) {
        return this.configService.updateConfig(serviceId, config);
    }

}
