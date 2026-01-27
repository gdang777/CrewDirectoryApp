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
import { useLocalSearchParams, Stack } from 'expo-router';
import { apiService } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import type { Place, PlaceComment } from '@crewdirectoryapp/shared';

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<number>(0);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadPlace();
    if (isAuthenticated) {
      loadUserVote();
    }
  }, [id, isAuthenticated]);

  const loadPlace = async () => {
    try {
      const data = await apiService.getPlace(id);
      setPlace(data);
    } catch (error) {
      console.error('Failed to load place:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVote = async () => {
    try {
      const vote = await apiService.getPlaceVote(id);
      setUserVote(vote.value);
    } catch (error) {
      // User hasn't voted
    }
  };

  const handleVote = async (value: 1 | -1) => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to vote');
      return;
    }
    try {
      const result = await apiService.votePlace(id, value);
      setPlace((prev) =>
        prev
          ? { ...prev, upvotes: result.upvotes, downvotes: result.downvotes }
          : prev
      );
      setUserVote(result.userVote);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to leave a review');
      return;
    }
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.addPlaceComment(id, {
        text: commentText.trim(),
        rating: commentRating,
      });
      setCommentText('');
      setCommentRating(5);
      loadPlace(); // Refresh to show new comment
      Alert.alert('Success', 'Your review has been added!');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Place not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: place.name }} />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        {place.imageUrl ? (
          <Image source={{ uri: place.imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroEmoji}>📍</Text>
          </View>
        )}
      </View>

      {/* Place Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{place.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {place.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>
              ({place.ratingCount} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.badges}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
          {place.city && (
            <View style={styles.cityBadge}>
              <Text style={styles.cityText}>📍 {place.city.name}</Text>
            </View>
          )}
        </View>

        {place.address && (
          <Text style={styles.address}>🏠 {place.address}</Text>
        )}

        <Text style={styles.description}>{place.description}</Text>

        {place.tips && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <Text style={styles.tipsText}>{place.tips}</Text>
          </View>
        )}

        {/* Voting */}
        <View style={styles.votingContainer}>
          <Text style={styles.sectionTitle}>Is this helpful?</Text>
          <View style={styles.voteButtons}>
            <TouchableOpacity
              style={[
                styles.voteButton,
                userVote === 1 && styles.voteButtonActive,
              ]}
              onPress={() => handleVote(1)}
            >
              <Text style={styles.voteIcon}>👍</Text>
              <Text style={styles.voteCount}>{place.upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.voteButton,
                userVote === -1 && styles.voteButtonActiveDown,
              ]}
              onPress={() => handleVote(-1)}
            >
              <Text style={styles.voteIcon}>👎</Text>
              <Text style={styles.voteCount}>{place.downvotes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Comment */}
        <View style={styles.addCommentContainer}>
          <Text style={styles.sectionTitle}>Leave a Review</Text>
          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setCommentRating(star)}
              >
                <Text style={styles.starIcon}>
                  {star <= commentRating ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your experience..."
            placeholderTextColor="#666"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitComment}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        {place.comments && place.comments.length > 0 && (
          <View style={styles.commentsContainer}>
            <Text style={styles.sectionTitle}>
              Reviews ({place.comments.length})
            </Text>
            {place.comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>
                    👤 {comment.user?.firstName || 'Anonymous'}
                  </Text>
                  <Text style={styles.commentRating}>
                    {'⭐'.repeat(comment.rating)}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
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
    height: 200,
    backgroundColor: '#1a1a2e',
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
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 14,
    color: '#a0a0b0',
    marginLeft: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#00d4ff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  cityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cityText: {
    color: '#a0a0b0',
    fontSize: 14,
  },
  address: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 20,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  votingContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  voteButtonActive: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderColor: '#00ff88',
  },
  voteButtonActiveDown: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderColor: '#ff4444',
  },
  voteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  voteCount: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  addCommentContainer: {
    marginBottom: 24,
  },
  ratingSelector: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starIcon: {
    fontSize: 28,
    marginRight: 4,
  },
  commentInput: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
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
  commentsContainer: {
    marginBottom: 40,
  },
  commentCard: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '500',
  },
  commentRating: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
});
