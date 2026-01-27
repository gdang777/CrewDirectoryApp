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
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { apiService } from '../../src/services/api';
import type { City, Place } from '@crewdirectoryapp/shared';
import { PlaceCategory } from '@crewdirectoryapp/shared';

const CATEGORY_TABS: {
  key: PlaceCategory | 'all';
  label: string;
  icon: string;
}[] = [
  { key: 'all', label: 'All', icon: '📍' },
  { key: PlaceCategory.EAT, label: 'Eat', icon: '🍽️' },
  { key: PlaceCategory.DRINK, label: 'Drink', icon: '🍸' },
  { key: PlaceCategory.SHOP, label: 'Shop', icon: '🛍️' },
  { key: PlaceCategory.VISIT, label: 'Visit', icon: '🏛️' },
];

export default function CityDetailsScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [city, setCity] = useState<City | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    PlaceCategory | 'all'
  >('all');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [code]);

  useEffect(() => {
    if (code) {
      loadPlaces();
    }
  }, [selectedCategory, code]);

  const loadData = async () => {
    try {
      const cityData = await apiService.getCityByCode(code);
      setCity(cityData);
      await loadPlaces();
    } catch (error) {
      console.error('Failed to load city:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaces = async () => {
    try {
      const options: any = { cityCode: code, sortBy: 'rating' };
      if (selectedCategory !== 'all') {
        options.category = selectedCategory;
      }
      const data = await apiService.getPlaces(options);
      setPlaces(data);
    } catch (error) {
      console.error('Failed to load places:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPlaces();
  };

  const handlePlacePress = (place: Place) => {
    router.push(`/place/${place.id}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: city?.name || 'City' }} />

      {/* City Header */}
      <View style={styles.header}>
        <Text style={styles.cityName}>{city?.name}</Text>
        <Text style={styles.cityCountry}>{city?.country}</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={CATEGORY_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedCategory === item.key && styles.tabActive,
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text style={styles.tabIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  selectedCategory === item.key && styles.tabLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabsList}
        />
      </View>

      {/* Places List */}
      <FlatList
        data={places}
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
            style={styles.placeCard}
            onPress={() => handlePlacePress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.placeImageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.placeImage}
                />
              ) : (
                <View style={styles.placeImagePlaceholder}>
                  <Text style={styles.placeholderEmoji}>📍</Text>
                </View>
              )}
            </View>
            <View style={styles.placeInfo}>
              <View style={styles.placeHeader}>
                <Text style={styles.placeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ⭐ {item.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.placeDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.placeFooter}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.reviewCount}>
                  {item.ratingCount}{' '}
                  {item.ratingCount === 1 ? 'review' : 'reviews'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No places found</Text>
            <Text style={styles.emptySubtext}>Try a different category</Text>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cityCountry: {
    fontSize: 16,
    color: '#a0a0b0',
    marginTop: 4,
  },
  tabsContainer: {
    marginBottom: 8,
  },
  tabsList: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  tabActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    color: '#a0a0b0',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#000',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  placeImageContainer: {
    width: 100,
    height: 100,
  },
  placeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  placeInfo: {
    flex: 1,
    padding: 12,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#ffd700',
    fontWeight: '600',
  },
  placeDescription: {
    fontSize: 13,
    color: '#a0a0b0',
    marginBottom: 8,
    lineHeight: 18,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#00d4ff',
    textTransform: 'capitalize',
  },
  reviewCount: {
    fontSize: 11,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
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
