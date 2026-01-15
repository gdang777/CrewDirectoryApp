import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Playbook } from './playbook.entity';

@Entity('playbook_edits')
export class PlaybookEdit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Playbook, (playbook) => playbook.edits)
  @JoinColumn({ name: 'playbookId' })
  playbook: Playbook;

  @Column()
  playbookId: string;

  @ManyToOne(() => User, (user) => user.edits)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  content: string; // The edited content

  @Column({ type: 'text', nullable: true })
  changeDescription: string; // What was changed

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  approvedBy: string; // User ID who approved

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
