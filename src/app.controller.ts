/* eslint-disable */
import { Body, Controller, Put } from '@nestjs/common';

@Controller()
export class AppController {

    @Put()
    public setServiceConfig(@Body() config: any) {
        // TODO: Set configs for service
        // This route needs authentication using the serviceSecret and serviceClientId and should set the config for the associated service ID
    }
}
