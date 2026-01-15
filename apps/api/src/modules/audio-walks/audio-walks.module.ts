import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioWalksController } from './audio-walks.controller';
import { AudioWalksService } from './audio-walks.service';
import * as entities from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [AudioWalksController],
  providers: [AudioWalksService],
  exports: [AudioWalksService],
})
export class AudioWalksModule {}
