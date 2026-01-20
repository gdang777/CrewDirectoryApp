import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../playbooks/entities/user.entity';
import { Place } from '../../places/entities/place.entity';

export enum InteractionType {
  VIEW = 'view',
  CLICK = 'click',
  SAVE = 'save',
  SHARE = 'share',
}

@Entity('user_interactions')
@Index(['userId', 'placeId', 'type']) // Optimize for checking existing interactions
export class UserInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  placeId: string;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId' })
  place: Place;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  type: InteractionType;

  // Optional: Metadata for more context (e.g., source page)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
