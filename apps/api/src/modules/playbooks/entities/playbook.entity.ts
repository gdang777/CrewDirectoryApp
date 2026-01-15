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
import { City } from './city.entity';
import { POI } from './poi.entity';
import { PlaybookEdit } from './playbook-edit.entity';

@Entity('playbooks')
export class Playbook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'basic' })
  tier: 'basic' | 'pro'; // basic = free, pro = paid

  @ManyToOne(() => City, (city) => city.playbooks)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  cityId: string;

  @OneToMany(() => POI, (poi) => poi.playbook)
  pois: POI[];

  @OneToMany(() => PlaybookEdit, (edit) => edit.playbook)
  edits: PlaybookEdit[];

  @Column({ type: 'int', default: 0 })
  upvotes: number;

  @Column({ type: 'int', default: 0 })
  downvotes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
