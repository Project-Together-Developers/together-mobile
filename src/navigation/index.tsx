import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { House, Map, MessageCircle, Plus, User, LucideIcon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { BottomTabParamList, RootStackParamList, AuthStackParamList } from './types';

import EventsScreen from '../screens/EventsScreen';
import MapScreen from '../screens/MapScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

interface TabIconProps {
  name: keyof BottomTabParamList;
  focused: boolean;
}

function TabIcon({ name, focused }: TabIconProps) {
  const icons: Record<keyof BottomTabParamList, LucideIcon> = {
    EventsTab: House,
    MapTab: Map,
    CreateEventTab: Plus,
    ChatTab: MessageCircle,
    ProfileTab: User,
  };

  const Icon = icons[name];
  const color = name === 'CreateEventTab' ? Colors.white : focused ? Colors.accent : Colors.textMuted;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={name === 'CreateEventTab' ? 28 : 22} color={color} strokeWidth={2.2} />
    </View>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: 11,
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="EventsTab" component={EventsScreen} options={{ tabBarLabel: 'Main' }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ tabBarLabel: t('tabs.map') }} />
      <Tab.Screen
        name="CreateEventTab"
        component={CreateEventScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                marginTop: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.primary,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 10,
                elevation: 7,
              }}
            >
              <TabIcon name="CreateEventTab" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen name="ChatTab" component={ChatScreen} options={{ tabBarLabel: t('tabs.chat') }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="VerifyOtp" component={OtpScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
