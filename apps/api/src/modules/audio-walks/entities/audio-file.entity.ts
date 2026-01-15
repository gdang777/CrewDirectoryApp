import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AudioWalk } from './audio-walk.entity';

@Entity('audio_files')
export class AudioFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AudioWalk, (walk) => walk.audioFiles)
  @JoinColumn({ name: 'audioWalkId' })
  audioWalk: AudioWalk;

  @Column()
  audioWalkId: string;

  @Column()
  url: string; // S3 URL or storage path

  @Column()
  language: string; // en, es, fr, etc.

  @Column({ nullable: true })
  transcription: string; // Auto-transcribed text

  @Column({ default: false })
  isTTS: boolean; // Text-to-speech fallback

  @Column({ type: 'int' })
  duration: number; // Duration in seconds

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
