import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AudioWalksService } from './audio-walks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audio-walks')
export class AudioWalksController {
  constructor(private readonly audioWalksService: AudioWalksService) {}

  @Get()
  async findAll(@Query('cityCode') cityCode?: string) {
    return this.audioWalksService.findAll(cityCode);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.audioWalksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req: any) {
    return this.audioWalksService.create(body, req.user.id);
  }

  @Post(':id/waypoints')
  @UseGuards(JwtAuthGuard)
  async addWaypoint(@Param('id') id: string, @Body() body: any) {
    return this.audioWalksService.addWaypoint(id, body);
  }

  @Post(':id/audio-files')
  @UseGuards(JwtAuthGuard)
  async uploadAudioFile(
    @Param('id') id: string,
    @Body() body: { url: string; language: string; duration: number },
  ) {
    return this.audioWalksService.uploadAudioFile(
      id,
      body.url,
      body.language,
      body.duration,
    );
  }

  @Post(':id/purchase')
  @UseGuards(JwtAuthGuard)
  async purchase(@Param('id') id: string, @Request() req: any) {
    return this.audioWalksService.purchase(id, req.user.id);
  }

  @Get(':id/waypoint')
  async getWaypointForLocation(
    @Param('id') id: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.audioWalksService.getWaypointForLocation(
      id,
      parseFloat(lat),
      parseFloat(lng),
    );
  }
}
