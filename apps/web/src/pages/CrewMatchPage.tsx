import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Message {
  userId: string;
  message: string;
  timestamp: string;
}

const CrewMatchPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [groupId, setGroupId] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId] = useState(
    () => 'user-' + Math.random().toString(36).substr(2, 9)
  ); // Mock User ID

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_crew_group', { groupId });

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, groupId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !input.trim()) return;

    socket.emit('send_message', {
      groupId,
      message: input,
      userId,
    });

    setInput('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Crew Match Chat</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>Group ID: </label>
        <input
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Enter flight number..."
        />
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          height: '400px',
          overflowY: 'scroll',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.userId === userId ? 'Me' : msg.userId}:</strong>{' '}
            {msg.message}
            <span
              style={{
                fontSize: '0.8rem',
                color: '#888',
                marginLeft: '0.5rem',
              }}
            >
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{ color: '#888' }}>No messages yet...</p>
        )}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CrewMatchPage;
