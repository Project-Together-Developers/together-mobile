import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { BorderRadius, Spacing } from '../../../theme/spacing';

interface SpotsInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  labelIcon?: React.ReactNode;
  label?: string;
  minValue?: number;
}

export default function SpotsInput({ value, onChange, error, labelIcon, label, minValue = 1 }: SpotsInputProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors, !!error), [colors, error]);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;

    const newNum = parseInt(value, 10);
    const prevNum = parseInt(prevValue.current, 10);
    const direction = newNum > prevNum ? 1 : -1;

    translateY.setValue(direction * 28);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 12,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();

    prevValue.current = value;
  }, [value]);

  const increment = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n < 999) onChange(String(n + 1));
  };

  const decrement = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n > minValue) onChange(String(n - 1));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        {labelIcon && <View style={styles.labelIconWrap}>{labelIcon}</View>}
        <Text style={styles.label}>{label ?? t('createEvent.spotsLabel')}</Text>
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={decrement} style={styles.btn} activeOpacity={0.7}>
          <Text>−</Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Animated.Text style={[styles.value, { transform: [{ translateY }], opacity }]}>
            {value}
          </Animated.Text>
        </View>
        <TouchableOpacity onPress={increment} style={styles.btn} activeOpacity={0.7}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors'], hasError: boolean) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: Spacing.md,
      backgroundColor: colors.input,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: hasError ? colors.error : colors.border,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    labelIconWrap: { justifyContent: 'center' },
    label: {
      color: colors.textSecondary,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
    },
    valueContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      height: 44,
    },
    value: {
      color: colors.text,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.lg,
      textAlign: 'center',
    },
    btn: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.full,
      borderColor: colors.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      marginTop: Spacing.xs,
      color: colors.error,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
    },
  });
