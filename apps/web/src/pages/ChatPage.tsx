import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import apiService, { ChatRoom } from '../services/api';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  // const navigate = useNavigate();
  const { user } = useAuth();
  const { joinRoom, activeRoom, messages, sendMessage, isConnected } =
    useChat();

  const [inputValue, setInputValue] = useState('');
  const [roomDetails, setRoomDetails] = useState<ChatRoom | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial load and join
  useEffect(() => {
    const initChat = async () => {
      if (!roomId || !user) return;

      try {
        // Fetch full room details (including participants)
        const roomData = await apiService.getRoom(roomId);
        setRoomDetails(roomData);

        // Join via socket
        joinRoom(roomData);
      } catch (error) {
        console.error('Failed to join chat', error);
        // Handle error (e.g., redirect to city page)
        // navigate(-1);
      }
    };

    if (isConnected) {
      initChat();
    }
  }, [roomId, isConnected, user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  if (!activeRoom && !roomDetails) {
    return (
      <div className="chat-page-loading">
        <Navbar />
        <div className="loading-container">
          Connecting to chat... (Room ID: {roomId})
        </div>
      </div>
    );
  }

  // Use activeRoom from context preferentially
  const room = activeRoom || roomDetails;

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-layout">
        {/* Sidebar - Participants */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h3>In this chat</h3>
          </div>
          <div className="participants-list">
            {room?.participants?.map((p) => (
              <div key={p.id} className="participant-item">
                <div className="participant-avatar">
                  {p.user.firstName?.[0] || p.user.name[0]}
                </div>
                <div className="participant-info">
                  <span className="participant-name">
                    {p.user.firstName
                      ? `${p.user.firstName} ${p.user.lastName || ''}`
                      : p.user.name}
                  </span>
                  {p.user.airlineId && (
                    <span className="participant-airline">
                      {p.user.airlineId}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {(!room?.participants || room.participants.length === 0) && (
              <div className="no-participants">No other users visible</div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          <header className="chat-main-header">
            <h2>{room?.name || 'Chat Room'}</h2>
            <span className="room-topic-badge">
              {room?.type === 'CITY_GROUP' ? 'City Chat' : 'Chat'}
            </span>
          </header>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-chat-placeholder">
                <div className="placeholder-icon">💬</div>
                <h3>Welcome to the chat!</h3>
                <p>Start the conversation.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`chat-message-row ${isMe ? 'message-own' : 'message-other'}`}
                  >
                    {!isMe && (
                      <div className="message-avatar">
                        {msg.sender?.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="message-content-wrapper">
                      {!isMe && (
                        <div className="message-sender-name">
                          {msg.sender?.name}
                          {msg.sender?.airlineId && (
                            <span className="msg-airline">
                              {msg.sender.airlineId}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="message-bubble">{msg.content}</div>
                      <div className="message-timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={!inputValue.trim()}>
              Send ✈️
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
