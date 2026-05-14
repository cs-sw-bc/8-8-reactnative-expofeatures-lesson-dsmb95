import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LocationScreen from './components/Location';
import PhotoLogScreen from './components/PhotoLog';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0f0f1a', borderTopColor: '#1c1c2e' },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            const icon = route.name === 'Restaurants' ? 'restaurant' : 'camera';
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Restaurants" component={LocationScreen} />
        <Tab.Screen name="Photo Log"   component={PhotoLogScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}