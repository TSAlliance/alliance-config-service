import { PageableRepository } from 'nestjs-pager';
import { EntityRepository } from 'typeorm';
import { Config } from './config.entity';

@EntityRepository(Config)
export default class ConfigRepository extends PageableRepository<Config> {
    
}
