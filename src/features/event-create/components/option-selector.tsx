import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';

interface OptionItem<T extends string> {
  value: T;
  label: string;
  icon?: (active: boolean) => React.ReactNode;
}

interface OptionSelectorProps<T extends string> {
  label: string;
  labelIcon?: React.ReactNode;
  options: OptionItem<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
  vertical?: boolean;
}

export default function OptionSelector<T extends string>({ label, labelIcon, options, value, onChange, error, vertical }: OptionSelectorProps<T>) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        {labelIcon && <View style={styles.labelIconWrap}>{labelIcon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.pillRow, vertical && { flexDirection: 'column' }]}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.pill,
                vertical && { flex: 0, height: 50, paddingTop: 15, alignItems: 'flex-start', justifyContent: "flex-start" },
                active && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.75}
            >
              {opt.icon && <View style={styles.iconContainer}>{opt.icon(active)}</View>}
              <Text style={[styles.pillText, active && { color: colors.white }]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    wrapper: {
      gap: Spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    labelIconWrap: { justifyContent: 'center' },
    label: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    pillRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    pill: {
      flex: 1,
      alignItems: 'center',
      justifyContent: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.input,
      height: 40,
      flexDirection: "row",
      gap: 5
    },
    iconContainer: {
      marginRight: Spacing.xs,
    },
    pillText: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      color: colors.text,
    },
    error: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.xs,
      color: colors.error,
    },
  });
