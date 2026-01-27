import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="city/[code]"
            options={{ title: 'City', headerShown: true }}
          />
          <Stack.Screen
            name="place/[id]"
            options={{ title: 'Place', headerShown: true }}
          />
          <Stack.Screen
            name="gig/[id]"
            options={{ title: 'Gig Details', headerShown: true }}
          />
          <Stack.Screen
            name="auth"
            options={{
              title: 'Sign In',
              headerShown: true,
              presentation: 'modal',
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
