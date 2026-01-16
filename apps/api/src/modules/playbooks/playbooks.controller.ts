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
import { PlaybooksService } from './playbooks.service';
import { CreatePlaybookDto, CreatePOIDto, CreateEditDto, VoteDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('playbooks')
export class PlaybooksController {
  constructor(private readonly playbooksService: PlaybooksService) {}

  @Get()
  async findAll(@Query('cityId') cityId?: string) {
    return this.playbooksService.findAll(cityId);
  }

  @Get('cities')
  async findAllCities() {
    return this.playbooksService.findAllCities();
  }

  @Get('cities/:code')
  async findCityByCode(@Param('code') code: string) {
    return this.playbooksService.findCityByCode(code);
  }

  @Post('cities')
  async createCity(
    @Body()
    body: {
      name: string;
      country: string;
      code: string;
      coordinates?: { lat: number; lng: number };
    }
  ) {
    return this.playbooksService.createCity(body);
  }

  @Get('pois/nearby')
  async findPOIsNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string
  ) {
    return this.playbooksService.findPOIsNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playbooksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreatePlaybookDto, @Request() req: any) {
    const userId = req.user.id;
    return this.playbooksService.create(createDto, userId);
  }

  @Post('pois')
  @UseGuards(JwtAuthGuard)
  async createPOI(@Body() createDto: CreatePOIDto) {
    return this.playbooksService.createPOI(createDto);
  }

  @Post('edits')
  @UseGuards(JwtAuthGuard)
  async createEdit(@Body() createDto: CreateEditDto, @Request() req: any) {
    const userId = req.user.id;
    return this.playbooksService.createEdit(createDto, userId);
  }

  @Post('votes')
  @UseGuards(JwtAuthGuard)
  async vote(@Body() voteDto: VoteDto, @Request() req: any) {
    const userId = req.user.id;
    return this.playbooksService.vote(voteDto, userId);
  }
}
