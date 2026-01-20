import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';
import { InteractionType } from './entities/user-interaction.entity';

class TrackInteractionDto {
  placeId: string;
  type: InteractionType;
}

@Controller('ai/recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Post('interaction')
  async trackInteraction(@Request() req, @Body() dto: TrackInteractionDto) {
    return this.recommendationsService.trackInteraction(
      req.user.id,
      dto.placeId,
      dto.type
    );
  }

  @Get()
  async getRecommendations(
    @Request() req,
    @Query('cityCode') cityCode: string
  ) {
    return this.recommendationsService.getRecommendations(
      req.user.id,
      cityCode
    );
  }
}
