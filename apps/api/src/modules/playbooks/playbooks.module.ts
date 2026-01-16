import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaybooksController } from './playbooks.controller';
import { PlaybooksService } from './playbooks.service';
import { User } from './entities/user.entity';
import { City } from './entities/city.entity';
import { Playbook } from './entities/playbook.entity';
import { POI } from './entities/poi.entity';
import { PlaybookEdit } from './entities/playbook-edit.entity';
import { Vote } from './entities/vote.entity';
import { SavedListing } from './entities/saved-listing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      City,
      Playbook,
      POI,
      PlaybookEdit,
      Vote,
      SavedListing,
    ]),
  ],
  controllers: [PlaybooksController],
  providers: [PlaybooksService],
  exports: [PlaybooksService],
})
export class PlaybooksModule {}
