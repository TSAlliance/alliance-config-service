import { Body, Controller, Param, Post } from '@nestjs/common';

@Controller('migrations')
export class MigrationsController {

    @Post(":serviceId")
    public initiateMigration(@Param() serviceId: string, @Body() migration: any) {
        console.log(serviceId);
        console.log(migration);
    }

}
