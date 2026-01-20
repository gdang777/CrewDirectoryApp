import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../playbooks/entities/user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'simple-array', nullable: true })
  favoriteCategories: string[];

  @Column({ type: 'simple-array', nullable: true })
  favoriteCities: string[];

  @Column({ type: 'varchar', nullable: true })
  pricePreference: string; // 'budget', 'moderate', 'luxury'

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
