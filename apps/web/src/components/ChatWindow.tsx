import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import './ChatWindow.css';

const ChatWindow: React.FC = () => {
  const {
    activeRoom,
    messages,
    sendMessage,
    leaveRoom,
    isChatOpen,
    toggleChat,
  } = useChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const location = useLocation();

  // Hide chat window on specific chat page to avoid duplication
  if (location.pathname.startsWith('/chat/')) {
    return null;
  }

  if (!isChatOpen || !activeRoom) {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const getRoomName = () => {
    if (activeRoom.name) return activeRoom.name;
    if (activeRoom.type === 'CITY_GROUP')
      return `${activeRoom.metadata?.cityCode} Layover Chat`;
    if (activeRoom.type === 'DM') return 'Direct Message';
    return 'Chat';
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{getRoomName()}</h3>
        <div className="chat-controls">
          <button
            onClick={toggleChat}
            className="minimize-btn"
            title="Minimize"
          >
            _
          </button>
          <button onClick={leaveRoom} className="close-btn" title="Close">
            ×
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Say hi!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`message ${isMe ? 'message-own' : 'message-other'}`}
              >
                {!isMe && (
                  <div className="message-sender">
                    {msg.sender?.name || 'Unknown'}
                    {msg.sender?.airlineId && msg.sender.airlineId !== 'OT' && (
                      <span
                        className="airline-tag"
                        style={{
                          marginLeft: '4px',
                          opacity: 0.8,
                          fontSize: '0.8em',
                          border: '1px solid currentColor',
                          borderRadius: '4px',
                          padding: '0 4px',
                        }}
                      >
                        {msg.sender.airlineId}
                      </span>
                    )}
                  </div>
                )}
                <div className="message-bubble">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
