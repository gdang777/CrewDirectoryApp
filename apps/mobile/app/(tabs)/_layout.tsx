import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '../../src/context/AuthContext';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: '#1a1a2e',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#0a0a0f',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cities',
          tabBarLabel: 'Cities',
          tabBarIcon: ({ color }) => <TabIcon name="🏙️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gigs"
        options={{
          title: 'Gigs',
          tabBarLabel: 'Gigs',
          tabBarIcon: ({ color }) => <TabIcon name="💼" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Shop',
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <TabIcon name="🛍️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="crew"
        options={{
          title: 'Chat',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <TabIcon name="💬" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? 'Profile' : 'Sign In',
          tabBarLabel: isAuthenticated ? 'Profile' : 'Sign In',
          tabBarIcon: ({ color }) => (
            <TabIcon name={isAuthenticated ? '👤' : '🔑'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple emoji-based tab icon component
function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <React.Fragment>
      {/* Emoji icons work well for prototyping */}
      <span style={{ fontSize: 20 }}>{name}</span>
    </React.Fragment>
  );
}
