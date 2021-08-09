import { Module } from '@nestjs/common';
import { ServiceManagementController } from './service-management/service-management.controller';
import { MigrationsController } from './migrations/migrations.controller';
import { ServiceManagementService } from './service-management/service-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ServiceRepository from './service-management/service.repository';
import { ConfigModule } from '@nestjs/config';
import { ConfigManagementController } from './config-management/config-management.controller';
import { ConfigManagementService } from './config-management/config-management.service';
import ConfigRepository from './config-management/config-management.repository';
import { MigrationService } from './migrations/migrations.service';
import { Validator } from "@tsalliance/rest"

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: [".dev.env", ".prod.env", "*.env"]}),  // Load .env file for configuration
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        "dist/**/*.entity{ .ts,.js}",
      ],
      synchronize: true,
      entityPrefix: "acs_",
      retryAttempts: Number.MAX_VALUE,
      retryDelay: 10000
    }),
    TypeOrmModule.forFeature([ServiceRepository, ConfigRepository])
  ],
  controllers: [
    ServiceManagementController,
    MigrationsController,
    ConfigManagementController,
  ],
  providers: [ServiceManagementService, Validator, ConfigManagementService, MigrationService],
})
export class AppModule {}
