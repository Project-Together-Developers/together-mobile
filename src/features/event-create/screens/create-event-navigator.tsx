import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateEventStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/theme-provider';
import { useEventForm, EventFormContext } from '../hooks/use-event-form';
import StepOneScreen from './step-one-screen';
import StepTwoScreen from './step-two-screen';
import StepThreeScreen from './step-three-screen';
import SuccessScreen from './success-screen';

const Stack = createNativeStackNavigator<CreateEventStackParamList>();

export default function CreateEventNavigator() {
  const { colors } = useAppTheme();
  const formApi = useEventForm();

  return (
    <EventFormContext.Provider value={formApi}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="CreateStep1" component={StepOneScreen} />
        <Stack.Screen name="CreateStep2" component={StepTwoScreen} />
        <Stack.Screen name="CreateStep3" component={StepThreeScreen} />
        <Stack.Screen
          name="CreateSuccess"
          component={SuccessScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </EventFormContext.Provider>
  );
}
