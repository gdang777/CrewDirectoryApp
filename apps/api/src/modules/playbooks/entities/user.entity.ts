import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlaybookEdit } from './playbook-edit.entity';
import { Vote } from './vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  airlineId: string;

  @Column({ default: false })
  verifiedBadge: boolean;

  @Column({ type: 'int', default: 0 })
  karmaScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PlaybookEdit, (edit) => edit.user)
  edits: PlaybookEdit[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
