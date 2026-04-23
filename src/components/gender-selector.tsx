import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Gender } from '../interfaces/user';
import { useAppTheme } from '../theme/theme-provider';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface GenderSelectorProps {
  label: string;
  value?: Gender;
  onChange: (value: Gender | undefined) => void;
  maleLabel: string;
  femaleLabel: string;
}

export default function GenderSelector({
  label,
  value,
  onChange,
  maleLabel,
  femaleLabel,
}: GenderSelectorProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handlePress = (next: Gender) => {
    onChange(value === next ? undefined : next);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handlePress('male')}
          style={[styles.pill, value === 'male' && styles.pillActive]}
        >
          <Text style={[styles.pillText, value === 'male' && styles.pillTextActive]}>
            {maleLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handlePress('female')}
          style={[styles.pill, value === 'female' && styles.pillActive]}
        >
          <Text style={[styles.pillText, value === 'female' && styles.pillTextActive]}>
            {femaleLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    wrapper: { marginBottom: Spacing.md },
    label: {
      color: colors.textSecondary,
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      marginBottom: Spacing.xs,
    },
    row: { flexDirection: 'row', gap: Spacing.sm },
    pill: {
      flex: 1,
      height: 52,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.input,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pillText: {
      color: colors.textSecondary,
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
    },
    pillTextActive: { color: colors.white },
  });
