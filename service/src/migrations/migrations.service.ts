import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigManagementService } from "src/config-management/config-management.service";
import { Config } from "src/config-management/config.entity";
import { Migration, MigrationAction } from "./migration.model";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const deepmerge = require('deepmerge')

@Injectable() 
export class MigrationService {
    constructor(private configService: ConfigManagementService){}

    public async migrate(serviceId: string, configId: string, migration: Migration): Promise<Config> {       
        const config = await this.configService.findConfigByServiceAndConfigId(serviceId, configId);
        if(!config) throw new NotFoundException();    

        config.schema = deepmerge(config.schema, this.processAddMigration(migration))
        config.schema = this.processDeleteMigration(config, migration);
        config.schema = this.processUpdateMigration(config, migration);

        config.version++;

        return this.configService.saveConfig(config);
    }

    private processAddMigration(migration: Migration): Record<string, any> {
        const paths: Array<string[]> = migration.add.map((addMigration) => {
            return addMigration.path.split(".");
        })
        const vals: any[] = migration.add.map((addMigration) => {
            return addMigration.value;
        })

        let scheme = {}

        for(const path of paths) {
            const valIndex = paths.indexOf(path);
            let cfg = {};

            // From last path to first, so that we can nest the actual value inside of objects
            for(const key of path.reverse()) {                  
                const index = path.indexOf(key);

                if(index == 0) {                    
                    cfg[key] = vals[valIndex];
                } else {
                    const tmp = {};
                    tmp[key] = { ...cfg };
                    cfg = { ...tmp };
                }
            }
            
            scheme = deepmerge(scheme, cfg);
        }

        return scheme;
    }

    private processDeleteMigration(config: Config, migration: Migration): Record<string, any> {
        const paths: Array<string[]> = migration.delete.map((delMigration) => {
            return delMigration.split(".")
        })

        for(const keys of paths) {
            const prop = keys.pop();
            const parent = keys.reduce((obj, key) => obj[key], config.schema);

            if(parent && parent[prop]) delete parent[prop];
        }

        return config.schema;
    }

    private processUpdateMigration(config: Config, migration: Migration): Record<string, any> {
        const paths: Array<string[]> = migration.update.map((updateMigration) => {
            return updateMigration.path.split(".")
        })
        const actions: Array<MigrationAction> = migration.update.map((updateMigration) => {
            return updateMigration.action;
        })
        const vals: Array<MigrationAction> = migration.update.map((updateMigration) => {
            return updateMigration.value;
        })

        while(paths.length > 0) {
            const keys = paths.pop();
            const prop = keys.pop();
            const action = actions.pop();
            const value = vals.pop();

            let tmp = config.schema;
            while(keys.length > 0) {
                tmp = tmp[keys.pop()];
            }

            if(action == "UPDATE_FIELD_ID") {
                const fieldVal = tmp[prop];
                delete tmp[prop];
                tmp[value] = fieldVal;
                continue;
            }

            if(action == "UPDATE_DATA_TYPE") {
                // Update data type means, that the field's value is replaced by the migration's value
                delete tmp[prop];
                tmp[prop] = value;
            }
        }        

        return config.schema;
    }
}