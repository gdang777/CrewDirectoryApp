export * from './PlaybooksScreen';
export * from './ProductsScreen';

// Keeping placeholders for others for now
import { View, Text, StyleSheet } from 'react-native';

export const CrewMatchScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Crew Match</Text>
    <Text>Coming soon: Find your crew and chat</Text>
  </View>
);

export const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>My Profile</Text>
    <Text>Coming soon: Stats and badge verification</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
