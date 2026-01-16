import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Playbook } from './playbook.entity';

@Entity('saved_listings')
@Unique(['userId', 'playbookId'])
export class SavedListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Playbook, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playbookId' })
  playbook: Playbook;

  @Column()
  playbookId: string;

  @CreateDateColumn()
  createdAt: Date;
}
