import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { User } from '../playbooks/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // Find or Create a City Group Chat (Legacy/Default)
  async getCityRoom(cityCode: string): Promise<ChatRoom> {
    let room = await this.chatRoomRepository.findOne({
      where: {
        type: ChatRoomType.CITY_GROUP,
        metadata: cityCode,
        name: `${cityCode} Crew Chat`,
      },
    });

    if (!room) {
      room = this.chatRoomRepository.create({
        type: ChatRoomType.CITY_GROUP,
        metadata: cityCode,
        name: `${cityCode} Crew Chat`,
      });
      await this.chatRoomRepository.save(room);
    }

    return room;
  }

  // Get Room by ID with participants
  async getRoom(roomId: string): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['participants'],
    });
  }

  // List all rooms for a city
  async getCityRooms(cityCode: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find({
      where: { type: ChatRoomType.CITY_GROUP, metadata: cityCode },
      order: { createdAt: 'DESC' },
      relations: ['participants'], // Optional: show participant count
    });
  }

  // Create a new topic-based room for a city
  async createCityRoom(
    cityCode: string,
    name: string,
    creatorId: string
  ): Promise<ChatRoom> {
    const room = this.chatRoomRepository.create({
      type: ChatRoomType.CITY_GROUP,
      metadata: cityCode,
      name: name,
    });

    // Add creator as participant? Not strictly necessary for group chat model but good for tracking
    const user = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (user) {
      room.participants = [user];
    }

    return this.chatRoomRepository.save(room);
  }

  // Get/Create DM Room between two users
  async getDmRoom(userId1: string, userId2: string): Promise<ChatRoom> {
    // This is a simplified check. In production, you'd check connection tables.
    // For now, we'll search for a DM room that contains both users.
    // OPTIMIZATION: Metadata could store "uuid1_uuid2" sorted.
    const sortedIds = [userId1, userId2].sort().join('_');

    let room = await this.chatRoomRepository.findOne({
      where: { type: ChatRoomType.DM, metadata: sortedIds },
    });

    if (!room) {
      const user1 = await this.userRepository.findOne({
        where: { id: userId1 },
      });
      const user2 = await this.userRepository.findOne({
        where: { id: userId2 },
      });

      if (!user1 || !user2) throw new NotFoundException('User not found');

      room = this.chatRoomRepository.create({
        type: ChatRoomType.DM,
        metadata: sortedIds,
        participants: [user1, user2],
      });
      await this.chatRoomRepository.save(room);
    }

    return room;
  }

  async getRoomMessages(
    roomId: string,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { roomId },
      relations: ['sender'],
      order: { createdAt: 'DESC' }, // Latest first
      take: limit,
    });
  }

  async saveMessage(
    roomId: string,
    senderId: string,
    content: string
  ): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create({
      roomId,
      senderId,
      content,
    });

    await this.chatMessageRepository.save(message);

    return this.chatMessageRepository.findOne({
      where: { id: message.id },
      relations: ['sender'],
    });
  }
}
