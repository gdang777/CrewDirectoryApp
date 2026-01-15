import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Point } from 'geojson';
import { AudioWalk } from './audio-walk.entity';

@Entity('waypoints')
@Index(['coordinates'], { spatial: true })
export class Waypoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AudioWalk, (walk) => walk.waypoints)
  @JoinColumn({ name: 'audioWalkId' })
  audioWalk: AudioWalk;

  @Column()
  audioWalkId: string;

  @Column()
  order: number; // Order in the walk sequence

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @Column({ nullable: true })
  triggerRadius: number; // Meters - GPS triggers audio at this distance

  @Column({ nullable: true })
  audioFileId: string; // Reference to audio file to play

  @CreateDateColumn()
  createdAt: Date;
}
