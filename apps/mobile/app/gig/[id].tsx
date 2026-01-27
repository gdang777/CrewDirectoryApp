import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { apiService } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import type { Gig } from '@crewdirectoryapp/shared';

const CATEGORY_ICONS: Record<string, string> = {
  flight_attendant: '✈️',
  pilot: '🛫',
  ground_crew: '🧰',
  hospitality: '🏨',
  driving: '🚗',
  other: '📋',
};

export default function GigDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    try {
      const data = await apiService.getGig(id);
      setGig(data);
    } catch (error) {
      console.error('Failed to load gig:', error);
    } finally {
      setLoading(false);
    }
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

  const handleApply = async () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to apply for gigs', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth') },
      ]);
      return;
    }

    setApplying(true);
    try {
      await apiService.applyToGig(id, applicationMessage || undefined);
      setShowApplyForm(false);
      setApplicationMessage('');
      Alert.alert(
        'Application Submitted',
        'The poster will be notified of your application.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  if (!gig) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Gig not found</Text>
      </View>
    );
  }

  const isOwnGig = user?.id === gig.posterId;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Gig Details' }} />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        {gig.imageUrl ? (
          <Image source={{ uri: gig.imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroEmoji}>
              {CATEGORY_ICONS[gig.category] || '💼'}
            </Text>
          </View>
        )}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{gig.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>
              {CATEGORY_ICONS[gig.category] || '📋'}
            </Text>
            <Text style={styles.categoryText}>
              {gig.category.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.title}>{gig.title}</Text>
          <Text style={styles.location}>📍 {gig.city?.name || 'Unknown'}</Text>
        </View>

        {/* Pay Info */}
        <View style={styles.payContainer}>
          <View style={styles.payCard}>
            <Text style={styles.payLabel}>Pay Rate</Text>
            <Text style={styles.payValue}>{formatPayRate(gig)}</Text>
          </View>
          {gig.duration && (
            <View style={styles.payCard}>
              <Text style={styles.payLabel}>Duration</Text>
              <Text style={styles.payValue}>{gig.duration}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{gig.description}</Text>
        </View>

        {/* Requirements */}
        {gig.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsText}>{gig.requirements}</Text>
            </View>
          </View>
        )}

        {/* Poster Info */}
        {gig.poster && (
          <View style={styles.posterContainer}>
            <Text style={styles.sectionTitle}>Posted By</Text>
            <View style={styles.posterCard}>
              <View style={styles.posterAvatar}>
                <Text style={styles.posterEmoji}>👤</Text>
              </View>
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>
                  {gig.poster.firstName} {gig.poster.lastName}
                </Text>
                {gig.poster.verifiedBadge && (
                  <Text style={styles.verifiedText}>✓ Verified Crew</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Apply Section */}
        {!isOwnGig && gig.status === 'open' && (
          <View style={styles.applySection}>
            {showApplyForm ? (
              <View style={styles.applyForm}>
                <Text style={styles.sectionTitle}>Apply for this Gig</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Add a message (optional)"
                  placeholderTextColor="#666"
                  value={applicationMessage}
                  onChangeText={setApplicationMessage}
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowApplyForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      applying && styles.submitButtonDisabled,
                    ]}
                    onPress={handleApply}
                    disabled={applying}
                  >
                    <Text style={styles.submitButtonText}>
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowApplyForm(true)}
              >
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isOwnGig && (
          <View style={styles.ownGigBanner}>
            <Text style={styles.ownGigText}>This is your gig listing</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  heroContainer: {
    height: 180,
    backgroundColor: '#1a1a2e',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 64,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#00d4ff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#a0a0b0',
  },
  payContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  payCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  payLabel: {
    fontSize: 12,
    color: '#a0a0b0',
    marginBottom: 4,
  },
  payValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00ff88',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  requirementsContainer: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  requirementsText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 22,
  },
  posterContainer: {
    marginBottom: 24,
  },
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  posterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  posterEmoji: {
    fontSize: 24,
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  verifiedText: {
    fontSize: 12,
    color: '#00ff88',
    marginTop: 2,
  },
  applySection: {
    marginBottom: 40,
  },
  applyButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  applyForm: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  messageInput: {
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#a0a0b0',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  ownGigBanner: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    alignItems: 'center',
  },
  ownGigText: {
    color: '#00d4ff',
    fontSize: 14,
  },
});
