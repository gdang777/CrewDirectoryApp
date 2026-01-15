import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AudioFile } from './audio-file.entity';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AudioFile)
  @JoinColumn({ name: 'audioFileId' })
  audioFile: AudioFile;

  @Column()
  audioFileId: string;

  @Column()
  targetLanguage: string; // Target language code

  @Column({ type: 'text' })
  translatedText: string;

  @Column({ nullable: true })
  translatedAudioUrl: string; // TTS audio URL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
