import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../../src/services/api';
import type { City } from '@crewdirectoryapp/shared';

export default function HomeScreen() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await apiService.getCities();
      setCities(data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCities();
  };

  const handleCityPress = (city: City) => {
    router.push(`/city/${city.code}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Loading cities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✈️ Crew Lounge</Text>
        <Text style={styles.subtitle}>Explore layover cities</Text>
      </View>

      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00d4ff"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityCard}
            onPress={() => handleCityPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cityImageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cityImage}
                />
              ) : (
                <View style={styles.cityImagePlaceholder}>
                  <Text style={styles.cityEmoji}>🌆</Text>
                </View>
              )}
            </View>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{item.name}</Text>
              <Text style={styles.cityCode}>{item.code}</Text>
              <Text style={styles.cityCountry}>{item.country}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cities found</Text>
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
    padding: 10,
    paddingBottom: 100,
  },
  cityCard: {
    flex: 1,
    margin: 6,
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  cityImageContainer: {
    height: 100,
    backgroundColor: '#1a1a2e',
  },
  cityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cityImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  cityEmoji: {
    fontSize: 36,
  },
  cityInfo: {
    padding: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cityCode: {
    fontSize: 12,
    color: '#00d4ff',
    marginTop: 2,
  },
  cityCountry: {
    fontSize: 12,
    color: '#a0a0b0',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#a0a0b0',
    fontSize: 16,
  },
});
