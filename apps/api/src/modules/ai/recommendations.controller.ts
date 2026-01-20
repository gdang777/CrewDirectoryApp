import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';
import { InteractionType } from './entities/user-interaction.entity';

@Controller('ai/recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('places')
  async getPlaceRecommendations(
    @Request() req,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.recommendationsService.getPlaceRecommendations(
      req.user.id,
      limit
    );
  }

  @Post('feedback')
  async logInteraction(
    @Request() req,
    @Body() dto: { placeId: string; type: InteractionType }
  ) {
    await this.recommendationsService.logInteraction(
      req.user.id,
      dto.placeId,
      dto.type
    );
    return { message: 'Feedback recorded' };
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.recommendationsService.getPreferences(req.user.id);
  }

  @Post('preferences')
  async updatePreferences(
    @Request() req,
    @Body()
    dto: {
      favoriteCategories?: string[];
      favoriteCities?: string[];
      pricePreference?: string;
    }
  ) {
    return this.recommendationsService.updatePreferences(req.user.id, dto);
  }
}
