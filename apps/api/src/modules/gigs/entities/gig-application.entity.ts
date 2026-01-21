import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Gig } from './gig.entity';
import { User } from '../../playbooks/entities/user.entity';

export type ApplicationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

@Entity('gig_applications')
@Unique(['gigId', 'applicantId'])
export class GigApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gig, (gig) => gig.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gigId' })
  gig: Gig;

  @Column()
  gigId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicantId' })
  applicant: User;

  @Column()
  applicantId: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ default: 'pending' })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
