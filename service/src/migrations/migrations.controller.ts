import { Body, Controller, Get, Param } from '@nestjs/common';
import { Migration } from './migration.model';
import { MigrationService } from './migrations.service';

@Controller('migrate')
export class MigrationsController {
    constructor(private migrationService: MigrationService){}

    @Get(":serviceId")
    public initiateMigration(@Param("serviceId") serviceId: string, @Body() migration: Migration) {
        return this.migrationService.migrate(serviceId, migration);
    }

}
