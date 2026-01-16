import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../playbooks/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.adminService.getUsers({ page, limit: Math.min(limit, 100) });
  }

  @Get('users/recent')
  async getRecentUsers(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number
  ) {
    return this.adminService.getRecentUsers(days);
  }

  @Get('listings')
  async getListings(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.adminService.getListings({ page, limit: Math.min(limit, 100) });
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: UserRole
  ) {
    return this.adminService.updateUserRole(userId, role);
  }

  @Get('edits/pending')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getPendingEdits() {
    return this.adminService.getPendingEdits();
  }
}
