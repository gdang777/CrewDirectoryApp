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
import type { Gig } from '@crewdirectoryapp/shared';

const CATEGORY_ICONS: Record<string, string> = {
  flight_attendant: '✈️',
  pilot: '🛫',
  ground_crew: '🧰',
  hospitality: '🏨',
  driving: '🚗',
  other: '📋',
};

export default function GigsScreen() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await apiService.getGigs({
        status: 'open',
        sortBy: 'newest',
      });
      setGigs(data);
    } catch (error) {
      console.error('Failed to load gigs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGigs();
  };

  const handleGigPress = (gig: Gig) => {
    router.push(`/gig/${gig.id}`);
  };

  const formatPayRate = (gig: Gig) => {
    const rate = `$${gig.payRate}`;
    switch (gig.payType) {
      case 'hourly':
        return `${rate}/hr`;
      case 'daily':
        return `${rate}/day`;
      case 'fixed':
        return rate;
      default:
        return rate;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading gigs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💼 Aviation Gigs</Text>
        <Text style={styles.subtitle}>Find work in layover cities</Text>
      </View>

      <FlatList
        data={gigs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00d4ff"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gigCard}
            onPress={() => handleGigPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.gigHeader}>
              <Text style={styles.categoryIcon}>
                {CATEGORY_ICONS[item.category] || '📋'}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {item.category.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.gigTitle}>{item.title}</Text>
            <Text style={styles.gigCity}>
              📍 {item.city?.name || 'Unknown'}
            </Text>
            <View style={styles.gigFooter}>
              <Text style={styles.payRate}>{formatPayRate(item)}</Text>
              {item.duration && (
                <Text style={styles.duration}>⏱️ {item.duration}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💼</Text>
            <Text style={styles.emptyText}>No gigs available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new opportunities
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
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  gigCard: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  gigHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#00d4ff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  gigTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  gigCity: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 12,
  },
  gigFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payRate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00ff88',
  },
  duration: {
    fontSize: 14,
    color: '#a0a0b0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#a0a0b0',
    fontSize: 14,
  },
});
