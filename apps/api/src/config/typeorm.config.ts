import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as entities from '../modules/playbooks/entities';
import * as productEntities from '../modules/products/entities';
import * as crewMatchEntities from '../modules/crew-match/entities';
import * as audioWalkEntities from '../modules/audio-walks/entities';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'crew_directory'),
  entities: [
    ...Object.values(entities),
    ...Object.values(productEntities),
    ...Object.values(crewMatchEntities),
    ...Object.values(audioWalkEntities),
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false in production - use migrations
  logging: configService.get<string>('NODE_ENV') === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
