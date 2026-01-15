import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Playbook } from './playbook.entity';

@Entity('votes')
@Unique(['userId', 'playbookId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Playbook)
  @JoinColumn({ name: 'playbookId' })
  playbook: Playbook;

  @Column()
  playbookId: string;

  @Column({ type: 'int' })
  value: number; // 1 for upvote, -1 for downvote

  @CreateDateColumn()
  createdAt: Date;
}
