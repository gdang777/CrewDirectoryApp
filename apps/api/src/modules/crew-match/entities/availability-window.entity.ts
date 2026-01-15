import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { CrewMember } from './crew-member.entity';

@Entity('availability_windows')
export class AvailabilityWindow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CrewMember, (member) => member.availabilityWindows)
  @JoinColumn({ name: 'crewMemberId' })
  crewMember: CrewMember;

  @Column()
  crewMemberId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column()
  cityCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
