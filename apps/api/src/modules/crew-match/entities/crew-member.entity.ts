import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Pairing } from './pairing.entity';
import { AvailabilityWindow } from './availability-window.entity';

@Entity('crew_members')
export class CrewMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pairing, (pairing) => pairing.crewMembers)
  @JoinColumn({ name: 'pairingId' })
  pairing: Pairing;

  @Column()
  pairingId: string;

  @Column()
  userId: string; // Reference to User entity

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  role: string; // FA, Pilot, etc.

  @OneToMany(() => AvailabilityWindow, (window) => window.crewMember)
  availabilityWindows: AvailabilityWindow[];

  @CreateDateColumn()
  createdAt: Date;
}
