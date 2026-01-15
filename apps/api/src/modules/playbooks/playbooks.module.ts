import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaybooksController } from './playbooks.controller';
import { PlaybooksService } from './playbooks.service';
import * as entities from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [PlaybooksController],
  providers: [PlaybooksService],
  exports: [PlaybooksService],
})
export class PlaybooksModule {}
