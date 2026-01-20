import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';
import { AiChatService } from './ai-chat.service';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Itinerary } from './entities/itinerary.entity';
import { UserInteraction } from './entities/user-interaction.entity';
import { UserPreference } from './entities/user-preference.entity';
import { Place } from '../places/entities/place.entity';
import { City } from '../playbooks/entities/city.entity';
import { User } from '../playbooks/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Itinerary,
      UserInteraction,
      UserPreference,
      Place,
      City,
      User,
    ]),
  ],
  controllers: [ItineraryController, RecommendationsController],
  providers: [
    AiService,
    PromptService,
    AiChatService,
    ItineraryService,
    RecommendationsService,
  ],
  exports: [AiService, AiChatService, RecommendationsService],
})
export class AiModule {}
