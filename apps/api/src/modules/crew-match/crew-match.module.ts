import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewMatchController } from './crew-match.controller';
import { CrewMatchService } from './crew-match.service';
import { ICSParserService } from './ics-parser.service';
import * as entities from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [CrewMatchController],
  providers: [CrewMatchService, ICSParserService],
  exports: [CrewMatchService],
})
export class CrewMatchModule {}
