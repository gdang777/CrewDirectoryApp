import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import apiService, { ChatRoom } from '../services/api';
import './CityChatList.css';

import { useNavigate } from 'react-router-dom';

interface CityChatListProps {
  cityCode: string;
}

const CityChatList: React.FC<CityChatListProps> = ({ cityCode }) => {
  const navigate = useNavigate();
  const { joinRoom, isChatOpen, activeRoom } = useChat();
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadRooms();
  }, [cityCode]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCityRooms(cityCode);
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (room: ChatRoom) => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }
    // Navigate to full chat page
    navigate(`/chat/${room.id}`);
    // Optionally join socket here too for speed, but page will do it
    joinRoom(room);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || creating) return;

    try {
      setCreating(true);
      const room = await apiService.createCityRoom(
        cityCode,
        newRoomName.trim()
      );
      setRooms([room, ...rooms]);
      setShowCreateModal(false);
      setNewRoomName('');
      // Auto join and navigate
      navigate(`/chat/${room.id}`);
      joinRoom(room);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="chat-list-loading">Loading chats...</div>;

  return (
    <div className="city-chat-list">
      <div className="chat-list-header">
        <h3>{cityCode} Community Chats</h3>
        <button
          className="create-chat-btn"
          onClick={() => setShowCreateModal(true)}
          disabled={!isAuthenticated}
        >
          + New Topic
        </button>
      </div>

      {!isAuthenticated && (
        <div className="auth-notice">Sign in to join or create chats</div>
      )}

      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No active chats yet for {cityCode}.</p>
            <p>Start a conversation about flights, layovers, or activities!</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-info">
                <h4>{room.name || 'Untitled Chat'}</h4>
                <span className="participant-count">
                  👥 {room.participants?.length || 0} online
                </span>
              </div>
              <button
                className={`join-btn ${activeRoom?.id === room.id && isChatOpen ? 'active' : ''}`}
                onClick={() => handleJoin(room)}
              >
                {activeRoom?.id === room.id && isChatOpen ? 'Active' : 'Join'}
              </button>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Start a New Chat</h3>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Topic (e.g., BA123 Crew, Hiking Trip, etc.)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRoomName.trim() || creating}
                >
                  {creating ? 'Creating...' : 'Create Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Sign-In Modal */}
      {showSignInModal && (
        <div className="modal-overlay">
          <div className="modal-content sign-in-modal">
            <div className="sign-in-icon">🔐</div>
            <h3>Sign In Required</h3>
            <p>
              You need to be signed in to join chat rooms. Join our crew
              community to connect with other aviation professionals!
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowSignInModal(false)}>
                Maybe Later
              </button>
              <button onClick={() => navigate('/auth')} className="sign-in-btn">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityChatList;
