import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Waypoint } from './waypoint.entity';
import { AudioFile } from './audio-file.entity';
import { Purchase } from './purchase.entity';
import { User } from '../../playbooks/entities/user.entity';

@Entity('audio_walks')
export class AudioWalk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @Column()
  cityCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.99 })
  price: number;

  @OneToMany(() => Waypoint, (waypoint) => waypoint.audioWalk)
  waypoints: Waypoint[];

  @OneToMany(() => AudioFile, (file) => file.audioWalk)
  audioFiles: AudioFile[];

  @OneToMany(() => Purchase, (purchase) => purchase.audioWalk)
  purchases: Purchase[];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
