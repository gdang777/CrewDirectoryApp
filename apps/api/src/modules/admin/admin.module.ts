import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../playbooks/entities/user.entity';
import { Playbook } from '../playbooks/entities/playbook.entity';
import { PlaybookEdit } from '../playbooks/entities/playbook-edit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Playbook, PlaybookEdit])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
