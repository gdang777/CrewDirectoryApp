import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { City } from '../../playbooks/entities/city.entity';
import { User } from '../../playbooks/entities/user.entity';

export type GigCategory =
  | 'hospitality'
  | 'retail'
  | 'events'
  | 'services'
  | 'other';
export type GigStatus = 'active' | 'filled' | 'expired' | 'deleted';
export type PayType = 'hourly' | 'daily' | 'fixed';

@Entity('gigs')
export class Gig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: GigCategory;

  @ManyToOne(() => City, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  payRate: number;

  @Column()
  payType: PayType;

  @Column({ nullable: true })
  duration: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ default: 'active' })
  status: GigStatus;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postedById' })
  postedBy: User;

  @Column()
  postedById: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  postedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @OneToMany('GigApplication', 'gig')
  applications: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
