import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Would typically guard WS

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CrewMatchGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_crew_group')
  handleJoinGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(`group_${data.groupId}`);
    return { event: 'joined_group', data: data.groupId };
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() data: { groupId: string; message: string; userId: string }
  ) {
    this.server.to(`group_${data.groupId}`).emit('new_message', {
      userId: data.userId,
      message: data.message,
      timestamp: new Date(),
    });
  }
}
