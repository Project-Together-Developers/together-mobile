import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type BottomTabParamList = {
  EventsTab: undefined;
  MapTab: undefined;
  CreateEventTab: undefined;
  ChatTab: undefined;
  ProfileTab: undefined;
};

export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { eventId: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: { chatId: string; title: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  VerifyOtp: { phone: string };
};

export type EventsNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<EventsStackParamList>,
  BottomTabNavigationProp<BottomTabParamList>
>;
