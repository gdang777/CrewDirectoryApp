import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../playbooks/entities/user.entity';
import { Playbook } from '../playbooks/entities/playbook.entity';
import { SavedListing } from '../playbooks/entities/saved-listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Playbook, SavedListing])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
