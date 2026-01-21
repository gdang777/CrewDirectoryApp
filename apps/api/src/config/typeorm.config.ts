import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Playbook entities
import { User } from '../modules/playbooks/entities/user.entity';
import { City } from '../modules/playbooks/entities/city.entity';
import { Playbook } from '../modules/playbooks/entities/playbook.entity';
import { POI } from '../modules/playbooks/entities/poi.entity';
import { PlaybookEdit } from '../modules/playbooks/entities/playbook-edit.entity';
import { Vote } from '../modules/playbooks/entities/vote.entity';
import { SavedListing } from '../modules/playbooks/entities/saved-listing.entity';

// Places entities
import { Place } from '../modules/places/entities/place.entity';
import { Comment } from '../modules/places/entities/comment.entity';
import { PlaceVote } from '../modules/places/entities/place-vote.entity';

// Gigs entities
import { Gig } from '../modules/gigs/entities/gig.entity';
import { GigApplication } from '../modules/gigs/entities/gig-application.entity';

// Product entities
import * as productEntities from '../modules/products/entities';

// Crew match entities
import * as crewMatchEntities from '../modules/crew-match/entities';

// Audio walk entities
import * as audioWalkEntities from '../modules/audio-walks/entities';

config();

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');

// Build connection options - prefer DATABASE_URL for cloud databases
const getDataSourceOptions = (): DataSourceOptions => {
  const baseOptions = {
    type: 'postgres' as const,
    entities: [
      // Playbook entities (explicit)
      User,
      City,
      Playbook,
      POI,
      PlaybookEdit,
      Vote,
      SavedListing,
      // Places entities
      Place,
      Comment,
      PlaceVote,
      // Gigs entities
      Gig,
      GigApplication,
      // Other module entities
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
