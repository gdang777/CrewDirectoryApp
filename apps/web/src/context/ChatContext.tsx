import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { ChatMessage, ChatRoom } from '../services/api';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  activeRoom: ChatRoom | null;
  messages: ChatMessage[];
  joinCityRoom: (cityCode: string) => void;
  joinDMRoom: (otherUserId: string) => void;
  joinRoom: (room: ChatRoom) => void;
  sendMessage: (content: string) => void;
  sendAIMessage: (cityCode: string, message: string) => void;
  leaveRoom: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  unreadCount: number;
  aiMessages: Array<{ content: string; isTyping?: boolean }>;
  aiError: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount] = useState(0);
  const [aiMessages, setAiMessages] = useState<
    Array<{ content: string; isTyping?: boolean }>
  >([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // Initialize Socket
  useEffect(() => {
    if (!token) return;

    const socketInstance = io(
      import.meta.env.VITE_API_URL || 'http://localhost:3001',
      {
        auth: { token },
        autoConnect: false,
      }
    );

    socketInstance.connect();

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('ChatContext: Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('ChatContext: Socket disconnected');
    });

    socketInstance.on('joinedRoom', (room: ChatRoom) => {
      console.log('ChatContext: Joined room event:', room);
    });

    socketInstance.on('messageHistory', (history: ChatMessage[]) => {
      console.log('ChatContext: Received message history:', history.length);
      setMessages(history);
    });

    socketInstance.on('newMessage', (message: ChatMessage) => {
      console.log('ChatContext: New message received:', message);
      setMessages((prev) => {
        return [...prev, message];
      });
    });

    socketInstance.on('error', (error: any) => {
      console.error('ChatContext: Socket error:', error);
    });

    // AI-specific event listeners
    socketInstance.on(
      'aiResponse',
      (data: { content: string; cityCode: string }) => {
        console.log('ChatContext: AI response received');
        setAiMessages((prev) => [
          ...prev,
          { content: data.content, isTyping: false },
        ]);
        setAiError(null);
      }
    );

    socketInstance.on('aiError', (data: { error: string }) => {
      console.error('ChatContext: AI error:', data.error);
      setAiError(data.error);
      setAiMessages((prev) => prev.filter((msg) => !msg.isTyping));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const joinCityRoom = useCallback(
    (cityCode: string) => {
      console.log('ChatContext: joinCityRoom called for', cityCode);
      if (socket) {
        console.log('ChatContext: Emitting joinCityRoom event');
        socket.emit('joinCityRoom', cityCode, (response: any) => {
          console.log('ChatContext: joinCityRoom callback response:', response);
          if (response && response.status === 'joined') {
            setActiveRoom({
              id: response.roomId,
              type: 'CITY_GROUP',
              metadata: { cityCode },
              createdAt: '',
              updatedAt: '',
            });
            setIsChatOpen(true);
            console.log('ChatContext: Active room set and chat opened');
          }
        });
      } else {
        console.error(
          'ChatContext: Socket not initialized when calling joinCityRoom'
        );
      }
    },
    [socket]
  );

  const joinDMRoom = useCallback(
    (otherUserId: string) => {
      if (socket) {
        socket.emit('joinDMRoom', otherUserId, (response: any) => {
          if (response && response.status === 'joined') {
            setActiveRoom({
              id: response.roomId,
              type: 'DM',
              metadata: { otherUserId },
              createdAt: '',
              updatedAt: '',
            });
            setIsChatOpen(true);
          }
        });
      }
    },
    [socket]
  );

  const joinRoom = useCallback(
    (room: ChatRoom) => {
      if (socket) {
        // For now, simple join logic.
        // In future, backend might need 'joinRoom' event if we track participants strictly there
        // But since we use rooms for broadcast, client.join(roomId) is key.
        // We reuse 'joinCityRoom' logic but purely for socket joining?
        // Actually, we need a generic 'joinRoom' event on backend if we want to support any room ID.
        // For now, let's assume 'joinCityRoom' handles the city default.
        // We should add a generic 'joinRoom' event to gateway or reuse existing.

        // Let's add a generic listener on backend?
        // Or better: update backend gateway to have handleJoinRoom that takes ID.
        // For this iteration, let's implement 'joinRoom' event in backend too.

        socket.emit('joinRoom', room.id, (response: any) => {
          if (response && response.status === 'joined') {
            setActiveRoom(room);
            setIsChatOpen(true);
            // We might need to fetch history here or let the event handle it
          }
        });
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (socket && activeRoom) {
        socket.emit('sendMessage', { roomId: activeRoom.id, content });
      }
    },
    [socket, activeRoom]
  );

  const sendAIMessage = useCallback(
    (cityCode: string, message: string) => {
      if (socket) {
        // Add typing indicator
        setAiMessages((prev) => [...prev, { content: '', isTyping: true }]);
        setAiError(null);
        socket.emit('sendAIMessage', { cityCode, message });
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(() => {
    setActiveRoom(null);
    setMessages([]);
    setIsChatOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const value = {
    socket,
    isConnected,
    activeRoom,
    messages,
    joinCityRoom,
    joinDMRoom,
    joinRoom,
    sendMessage,
    sendAIMessage,
    leaveRoom,
    isChatOpen,
    toggleChat,
    unreadCount,
    aiMessages,
    aiError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
