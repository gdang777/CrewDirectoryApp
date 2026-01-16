import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007bff' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Playbooks',
          tabBarLabel: 'Playbooks',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Shop',
          tabBarLabel: 'Shop',
        }}
      />
      <Tabs.Screen
        name="crew"
        options={{
          title: 'Crew Match',
          tabBarLabel: 'Crew',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
