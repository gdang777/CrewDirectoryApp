import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import type { ChatRoom } from '@crewdirectoryapp/shared';

export default function CrewChatScreen() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      loadRooms();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadRooms = async () => {
    try {
      // Get rooms for popular cities
      const cityCodes = ['JFK', 'LHR', 'DXB', 'BKK', 'CPH'];
      const allRooms: ChatRoom[] = [];

      for (const code of cityCodes) {
        try {
          const cityRooms = await apiService.getCityRooms(code);
          allRooms.push(...cityRooms);
        } catch (e) {
          // Ignore errors for individual cities
        }
      }

      setRooms(allRooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  // Not logged in - show sign in prompt
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.signInContainer}>
          <Text style={styles.signInEmoji}>💬</Text>
          <Text style={styles.signInTitle}>Crew Chat</Text>
          <Text style={styles.signInSubtitle}>
            Connect with other crew members in city chat rooms. Sign in to join
            the conversation.
          </Text>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In to Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading chat rooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Crew Chat</Text>
        <Text style={styles.subtitle}>
          Connect with crew in your layover cities
        </Text>
      </View>

      {/* Featured City Rooms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Cities</Text>
        <View style={styles.cityGrid}>
          {['JFK', 'LHR', 'DXB', 'BKK', 'CPH', 'LAX'].map((code) => (
            <TouchableOpacity
              key={code}
              style={styles.cityCard}
              onPress={() => {
                // Navigate to city chat room
                // This would need a chat room screen
              }}
            >
              <Text style={styles.cityEmoji}>🌆</Text>
              <Text style={styles.cityCode}>{code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00d4ff"
          />
        }
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Active Rooms</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.roomCard}>
            <View style={styles.roomIcon}>
              <Text style={styles.roomEmoji}>💬</Text>
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomType}>{item.type} room</Text>
            </View>
            <Text style={styles.roomArrow}>›</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active rooms yet</Text>
            <Text style={styles.emptySubtext}>
              Visit a city page to join its chat room
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
  },
  loadingText: {
    marginTop: 12,
    color: '#a0a0b0',
    fontSize: 14,
  },
  // Sign In Screen
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  signInEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  signInSubtitle: {
    fontSize: 16,
    color: '#a0a0b0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  signInButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Main Screen
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  cityCard: {
    width: '30%',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  cityEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  cityCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
  },
  list: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  roomIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomEmoji: {
    fontSize: 20,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  roomType: {
    fontSize: 12,
    color: '#a0a0b0',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  roomArrow: {
    fontSize: 24,
    color: '#a0a0b0',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0a0b0',
  },
});
