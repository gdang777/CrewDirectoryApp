import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewMatchController } from './crew-match.controller';
import { CrewMatchService } from './crew-match.service';
import { ICSParserService } from './ics-parser.service';
import { CrewMatchGateway } from './crew-match.gateway';
import * as entities from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [CrewMatchController],
  providers: [CrewMatchService, ICSParserService, CrewMatchGateway],
  exports: [CrewMatchService],
})
export class CrewMatchModule {}
