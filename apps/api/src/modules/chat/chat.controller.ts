import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../playbooks/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms/:cityCode')
  async getCityRooms(@Param('cityCode') cityCode: string) {
    return this.chatService.getCityRooms(cityCode);
  }

  @Get('room/:roomId')
  async getRoom(@Param('roomId') roomId: string) {
    return this.chatService.getRoom(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms')
  async createCityRoom(
    @Body() body: { cityCode: string; name: string },
    @Request() req: any
  ) {
    return this.chatService.createCityRoom(
      body.cityCode,
      body.name,
      req.user.id
    );
  }
}
