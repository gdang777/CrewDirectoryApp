import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { UserInteraction } from './entities/user-interaction.entity';
import { Place } from '../places/entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInteraction, Place])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService], // Export if other modules need to track interactions
})
export class RecommendationsModule {}
