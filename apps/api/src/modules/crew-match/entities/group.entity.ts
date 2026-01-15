import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { CrewMember } from './crew-member.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => CrewMember)
  @JoinTable()
  members: CrewMember[];

  @Column()
  cityCode: string;

  @Column({ type: 'timestamp' })
  activityTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Auto-expires when crew clocks out

  @Column({ default: false })
  expired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
