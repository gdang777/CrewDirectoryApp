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
import { GigsService } from './gigs.service';
import {
  CreateGigDto,
  UpdateGigDto,
  FindAllGigsDto,
  ApplyToGigDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Get()
  async findAll(@Query() queryDto: FindAllGigsDto) {
    return this.gigsService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.gigsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateGigDto, @Request() req: any) {
    return this.gigsService.create(createDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGigDto,
    @Request() req: any
  ) {
    return this.gigsService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.gigsService.delete(id, req.user.id, req.user.role);
    return { message: 'Gig deleted' };
  }

  // Applications
  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async apply(
    @Param('id') id: string,
    @Body() dto: ApplyToGigDto,
    @Request() req: any
  ) {
    return this.gigsService.apply(id, req.user.id, dto);
  }

  @Get('applications/me')
  @UseGuards(JwtAuthGuard)
  async getMyApplications(@Request() req: any) {
    return this.gigsService.getMyApplications(req.user.id);
  }

  @Get(':id/applications')
  @UseGuards(JwtAuthGuard)
  async getGigApplications(@Param('id') id: string, @Request() req: any) {
    return this.gigsService.getGigApplications(id, req.user.id);
  }

  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: 'accepted' | 'rejected' },
    @Request() req: any
  ) {
    return this.gigsService.updateApplicationStatus(
      id,
      body.status,
      req.user.id
    );
  }
}
