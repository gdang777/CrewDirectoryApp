import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../playbooks/entities/user.entity';
import { City } from '../../playbooks/entities/city.entity';

export interface ItineraryItem {
  placeId: string;
  placeName: string;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  duration: number; // in minutes
  reason: string;
  tips?: string;
}

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ name: 'city_id' })
  cityId: string;

  @Column({ type: 'int' })
  duration: number; // in hours

  @Column({ type: 'jsonb' })
  items: ItineraryItem[];

  @Column({ type: 'jsonb', nullable: true })
  preferences: string[];

  @Column({ type: 'text', nullable: true })
  summary: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
