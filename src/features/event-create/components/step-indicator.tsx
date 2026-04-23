import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/theme-provider';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export default function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  const { colors } = useAppTheme();

  const w0 = useSharedValue(currentStep === 0 ? 24 : 8);
  const w1 = useSharedValue(currentStep === 1 ? 24 : 8);
  const w2 = useSharedValue(currentStep === 2 ? 24 : 8);

  const weights = [w0, w1, w2];

  useEffect(() => {
    weights.forEach((sv, i) => {
      sv.value = withTiming(currentStep === i ? 24 : 8, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    });
  }, [currentStep]);

  const style0 = useAnimatedStyle(() => ({ width: w0.value }));
  const style1 = useAnimatedStyle(() => ({ width: w1.value }));
  const style2 = useAnimatedStyle(() => ({ width: w2.value }));

  const animatedStyles = [style0, style1, style2];

  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: currentStep === i ? colors.primary : colors.border },
            animatedStyles[i],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
