import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Place } from './place.entity';
import { User } from '../../playbooks/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  // Star rating 1-5
  @Column({ type: 'int', default: 5 })
  rating: number;

  @ManyToOne(() => Place, (place) => place.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId' })
  place: Place;

  @Column()
  placeId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
