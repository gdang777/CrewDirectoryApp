import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';
import { Gig } from './entities/gig.entity';
import { GigApplication } from './entities/gig-application.entity';
import { City } from '../playbooks/entities/city.entity';
import { User } from '../playbooks/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gig, GigApplication, City, User])],
  controllers: [GigsController],
  providers: [GigsService],
  exports: [GigsService],
})
export class GigsModule {}
