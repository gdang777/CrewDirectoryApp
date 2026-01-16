import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService, UpdateProfileDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateDto: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(req.user.id, updateDto);
  }

  @Get('stats')
  async getUserStats(@Request() req: any) {
    return this.usersService.getUserStats(req.user.id);
  }

  @Get('listings')
  async getUserListings(@Request() req: any) {
    return this.usersService.getUserListings(req.user.id);
  }

  @Get('saved')
  async getSavedListings(@Request() req: any) {
    return this.usersService.getSavedListings(req.user.id);
  }

  @Post('saved/:playbookId')
  async saveListing(
    @Request() req: any,
    @Param('playbookId') playbookId: string
  ) {
    return this.usersService.saveListing(req.user.id, playbookId);
  }

  @Delete('saved/:playbookId')
  async unsaveListing(
    @Request() req: any,
    @Param('playbookId') playbookId: string
  ) {
    await this.usersService.unsaveListing(req.user.id, playbookId);
    return { message: 'Listing unsaved' };
  }

  @Get('saved/:playbookId/check')
  async checkIfSaved(
    @Request() req: any,
    @Param('playbookId') playbookId: string
  ) {
    const isSaved = await this.usersService.isListingSaved(
      req.user.id,
      playbookId
    );
    return { saved: isSaved };
  }
}
