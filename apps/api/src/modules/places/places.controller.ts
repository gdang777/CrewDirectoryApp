import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import {
  CreatePlaceDto,
  UpdatePlaceDto,
  CreateCommentDto,
  VotePlaceDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaceCategory } from './entities/place.entity';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async findAll(
    @Query('cityId') cityId?: string,
    @Query('cityCode') cityCode?: string,
    @Query('category') category?: PlaceCategory
  ) {
    return this.placesService.findAll({ cityId, cityCode, category });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreatePlaceDto, @Request() req: any) {
    return this.placesService.create(createDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlaceDto,
    @Request() req: any
  ) {
    return this.placesService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.placesService.delete(id, req.user.id, req.user.role);
    return { message: 'Place deleted' };
  }

  // Comments
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.placesService.getComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req: any
  ) {
    return this.placesService.addComment(id, req.user.id, dto);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req: any
  ) {
    await this.placesService.deleteComment(
      commentId,
      req.user.id,
      req.user.role
    );
    return { message: 'Comment deleted' };
  }

  // Voting
  @Get(':id/vote')
  @UseGuards(JwtAuthGuard)
  async getUserVote(@Param('id') id: string, @Request() req: any) {
    const value = await this.placesService.getUserVote(id, req.user.id);
    return { value };
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  async vote(
    @Param('id') id: string,
    @Body() dto: VotePlaceDto,
    @Request() req: any
  ) {
    return this.placesService.vote(id, req.user.id, dto);
  }
}
