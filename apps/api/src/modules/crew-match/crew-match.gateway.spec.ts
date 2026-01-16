import { Test, TestingModule } from '@nestjs/testing';
import { CrewMatchGateway } from './crew-match.gateway';
import { Socket } from 'socket.io';

describe('CrewMatchGateway', () => {
  let gateway: CrewMatchGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrewMatchGateway],
    }).compile();

    gateway = module.get<CrewMatchGateway>(CrewMatchGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleJoinGroup', () => {
    it('should join the client to the group room', () => {
      const mockClient = {
        join: jest.fn(),
      } as unknown as Socket;
      const data = { groupId: 'test-group' };

      const result = gateway.handleJoinGroup(data, mockClient);

      expect(mockClient.join).toHaveBeenCalledWith('group_test-group');
      expect(result).toEqual({ event: 'joined_group', data: 'test-group' });
    });
  });

  describe('handleMessage', () => {
    it('should emit new_message event to the group', () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      const data = {
        groupId: 'test-group',
        message: 'Hello World',
        userId: 'user1',
      };

      gateway.handleMessage(data);

      expect(mockServer.to).toHaveBeenCalledWith('group_test-group');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'new_message',
        expect.objectContaining({
          userId: 'user1',
          message: 'Hello World',
        })
      );
    });
  });
});
