import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../playbooks/entities/user.entity';
import { Place } from '../../places/entities/place.entity';

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  COMMENT = 'comment',
  SAVE = 'save',
  SKIP = 'skip',
}

@Entity('user_interactions')
@Index(['userId'])
@Index(['placeId'])
@Index(['createdAt'])
export class UserInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ name: 'place_id' })
  placeId: string;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  type: InteractionType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
