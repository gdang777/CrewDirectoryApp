import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as entities from '../modules/playbooks/entities';
import * as productEntities from '../modules/products/entities';
import * as crewMatchEntities from '../modules/crew-match/entities';
import * as audioWalkEntities from '../modules/audio-walks/entities';

config();

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');

// Build connection options - prefer DATABASE_URL for cloud databases
const getDataSourceOptions = (): DataSourceOptions => {
  const baseOptions = {
    type: 'postgres' as const,
    entities: [
      ...Object.values(entities),
      ...Object.values(productEntities),
      ...Object.values(crewMatchEntities),
      ...Object.values(audioWalkEntities),
    ],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: configService.get<string>('NODE_ENV') === 'development',
  };

  if (databaseUrl) {
    return {
      ...baseOptions,
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    ...baseOptions,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'crew_directory'),
  };
};

export const dataSourceOptions = getDataSourceOptions();
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
