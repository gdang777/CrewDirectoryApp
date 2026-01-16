import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place, Comment, PlaceVote } from './entities';
import { City } from '../playbooks/entities/city.entity';
import { User } from '../playbooks/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Comment, PlaceVote, City, User])],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
