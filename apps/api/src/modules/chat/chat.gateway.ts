import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Inject, Optional } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Optional() @Inject('AiChatService') private readonly aiChatService?: any
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization'];
      if (!token) {
        // Allow anonymous connection? No, force disconnect.
        console.log('No token provided');
        client.disconnect();
        return;
      }

      // Verify token
      const cleanToken = token.replace('Bearer ', '');
      const payload = this.jwtService.decode(cleanToken);
      if (!payload || !payload.sub) {
        console.log('Invalid token');
        client.disconnect();
        return;
      }

      // Store user ID in socket
      client.data.userId = payload.sub;
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCityRoom')
  async handleJoinCityRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() cityCode: string
  ) {
    const room = await this.chatService.getCityRoom(cityCode);
    client.join(room.id);
    console.log(
      `User ${client.data.userId} joined city room: ${cityCode} (${room.id})`
    );

    // Send history
    const history = await this.chatService.getRoomMessages(room.id);
    client.emit('messageHistory', history.reverse()); // Send oldest first for UI

    return { status: 'joined', roomId: room.id };
  }

  @SubscribeMessage('joinDMRoom')
  async handleJoinDMRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() otherUserId: string
  ) {
    if (!client.data.userId) return;

    const room = await this.chatService.getDmRoom(
      client.data.userId,
      otherUserId
    );
    client.join(room.id);
    console.log(
      `User ${client.data.userId} joined DM room with ${otherUserId}: (${room.id})`
    );

    // Send history
    const history = await this.chatService.getRoomMessages(room.id);
    client.emit('messageHistory', history.reverse());

    return { status: 'joined', roomId: room.id };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string
  ) {
    // Simple join by ID
    client.join(roomId);
    console.log(`User ${client.data.userId} joined room: ${roomId}`);

    // Send history
    const history = await this.chatService.getRoomMessages(roomId);
    client.emit('messageHistory', history.reverse());

    return { status: 'joined', roomId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string }
  ) {
    if (!client.data.userId) return;

    const message = await this.chatService.saveMessage(
      data.roomId,
      client.data.userId,
      data.content
    );

    // Broadcast to room
    this.server.to(data.roomId).emit('newMessage', message);

    return { status: 'sent', message };
  }

  @SubscribeMessage('sendAIMessage')
  async handleAIMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { cityCode: string; message: string }
  ) {
    if (!client.data.userId) return;

    // Check if AI service is available
    if (!this.aiChatService) {
      client.emit('aiError', {
        error:
          'AI features are not available. Please configure OpenAI API key.',
      });
      return { status: 'error', message: 'AI not configured' };
    }

    try {
      // Get AI response
      const response = await this.aiChatService.handleChatMessage(
        client.data.userId,
        data.cityCode,
        data.message
      );

      // Send AI response back to user
      client.emit('aiResponse', {
        content: response,
        cityCode: data.cityCode,
      });

      return { status: 'sent', response };
    } catch (error) {
      console.error('AI message error:', error);
      client.emit('aiError', {
        error: 'Failed to get AI response. Please try again.',
      });
      return { status: 'error' };
    }
  }
}
