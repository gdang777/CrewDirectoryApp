import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItineraryService } from './itinerary.service';

@Controller('ai/itinerary')
@UseGuards(JwtAuthGuard)
export class ItineraryController {
  constructor(private itineraryService: ItineraryService) {}

  @Post('generate')
  async generateItinerary(
    @Request() req,
    @Body()
    dto: {
      cityCode: string;
      duration: number;
      preferences?: string[];
      currentLocation?: { latitude: number; longitude: number };
    }
  ) {
    return this.itineraryService.generateItinerary(req.user.id, dto);
  }

  @Get('user')
  async getUserItineraries(@Request() req) {
    return this.itineraryService.getUserItineraries(req.user.id);
  }

  @Get(':id')
  async getItinerary(@Request() req, @Param('id') id: string) {
    return this.itineraryService.getItinerary(id, req.user.id);
  }

  @Delete(':id')
  async deleteItinerary(@Request() req, @Param('id') id: string) {
    await this.itineraryService.deleteItinerary(id, req.user.id);
    return { message: 'Itinerary deleted successfully' };
  }
}
