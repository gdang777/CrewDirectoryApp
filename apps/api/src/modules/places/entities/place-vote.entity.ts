import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Place } from './place.entity';
import { User } from '../../playbooks/entities/user.entity';

@Entity('place_votes')
@Unique(['placeId', 'userId'])
export class PlaceVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Place, (place) => place.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId' })
  place: Place;

  @Column()
  placeId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // 1 for upvote, -1 for downvote
  @Column({ type: 'int' })
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
