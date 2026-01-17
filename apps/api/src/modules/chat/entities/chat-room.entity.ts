import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { User } from '../../playbooks/entities/user.entity';

export enum ChatRoomType {
  CITY_GROUP = 'city_group',
  DM = 'dm',
  CUSTOM_GROUP = 'custom_group',
}

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ChatRoomType,
    default: ChatRoomType.CITY_GROUP,
  })
  type: ChatRoomType;

  // For City Groups: stores the city code (e.g., "LHR")
  @Column({ nullable: true })
  metadata: string;

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'chat_room_participants' })
  participants: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
