import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { House, Map, MessageCircle, Plus, User, LucideIcon } from 'lucide-react-native';
import { FontFamily } from '../theme/typography';
import { BottomTabParamList, RootStackParamList, AuthStackParamList } from './types';
import { useAppTheme } from '../theme/theme-provider';

import EventsScreen from '../screens/events-screen';
import MapScreen from '../screens/map-screen';
import CreateEventScreen from '../screens/create-event-screen';
import ChatScreen from '../screens/chat-screen';
import ProfileScreen from '../screens/profile-screen';
import SplashScreen from '../screens/splash-screen';
import LoginScreen from '../screens/login-screen';
import OtpScreen from '../screens/otp-screen';
import OnboardingScreen from '../screens/onboarding-screen';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

interface TabIconProps {
  name: keyof BottomTabParamList;
  color: string;
  size?: number;
}

function TabIcon({ name, color, size = 22 }: TabIconProps) {
  const icons: Record<keyof BottomTabParamList, LucideIcon> = {
    EventsTab: House,
    MapTab: Map,
    CreateEventTab: Plus,
    ChatTab: MessageCircle,
    ProfileTab: User,
  };

  const Icon = icons[name];
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={size} color={color} strokeWidth={2.2} />
    </View>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: 11,
          marginTop: -10,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={route.name}
            color={route.name === 'CreateEventTab' ? colors.white : focused ? colors.primary : colors.textMuted}
          />
        ),
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
                backgroundColor: colors.primary,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 10,
                elevation: 7,
              }}
            >
              <TabIcon name="CreateEventTab" color={colors.white} size={28} />
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
  const { colors } = useAppTheme();
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="VerifyOtp" component={OtpScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const { colors, isDark } = useAppTheme();
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      border: colors.border,
      text: colors.text,
      primary: colors.primary,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme} fallback={<View style={{ flex: 1, backgroundColor: colors.background }} />}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ gestureEnabled: false }}
        />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
