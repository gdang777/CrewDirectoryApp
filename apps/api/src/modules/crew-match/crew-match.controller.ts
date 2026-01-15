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
import { CrewMatchService } from './crew-match.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('crew-match')
export class CrewMatchController {
  constructor(private readonly crewMatchService: CrewMatchService) {}

  @Post('pairings')
  @UseGuards(JwtAuthGuard)
  async uploadPairing(@Body() body: { icsData: string }, @Request() req: any) {
    // Parse ICS and create pairing
    return { message: 'Pairing upload endpoint - ICS parsing to be implemented' };
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard)
  async setAvailability(
    @Body()
    body: {
      startTime: string;
      endTime: string;
      cityCode: string;
    },
    @Request() req: any,
  ) {
    return this.crewMatchService.setAvailability(
      req.user.id, // Would need crewMemberId mapping
      new Date(body.startTime),
      new Date(body.endTime),
      body.cityCode,
    );
  }

  @Get('available')
  async findAvailableCrew(
    @Query('cityCode') cityCode: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.crewMatchService.findAvailableCrew(
      cityCode,
      new Date(startTime),
      new Date(endTime),
    );
  }

  @Post('groups')
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() body: any) {
    return this.crewMatchService.createGroup(
      body.name,
      body.cityCode,
      new Date(body.activityTime),
      body.memberIds,
    );
  }

  @Get('activities')
  async getActivities(@Query('cityCode') cityCode: string) {
    return this.crewMatchService.getActivities(cityCode);
  }
}
