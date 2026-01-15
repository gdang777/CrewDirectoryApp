import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AudioWalk } from './audio-walk.entity';
import { User } from '../../playbooks/entities/user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AudioWalk, (walk) => walk.purchases)
  @JoinColumn({ name: 'audioWalkId' })
  audioWalk: AudioWalk;

  @Column()
  audioWalkId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creatorRevenue: number; // 70% of purchase

  @CreateDateColumn()
  createdAt: Date;
}
