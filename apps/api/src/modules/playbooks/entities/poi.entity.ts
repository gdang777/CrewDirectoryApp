import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Point } from 'geojson';
import { Playbook } from './playbook.entity';

@Entity('pois')
@Index(['coordinates'], { spatial: true })
export class POI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string; // restaurant, attraction, shop, etc.

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @ManyToOne(() => Playbook, (playbook) => playbook.pois)
  @JoinColumn({ name: 'playbookId' })
  playbook: Playbook;

  @Column()
  playbookId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>; // Additional POI data

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
