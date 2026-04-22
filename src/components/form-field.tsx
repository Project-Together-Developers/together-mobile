import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  optional?: boolean;
}

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  leftAdornment,
  rightAdornment,
  optional,
  ...rest
}: FormFieldProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors, !!error), [colors, error]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}>·</Text>}
      </View>
      <View style={styles.inputRow}>
        {leftAdornment && <View style={styles.left}>{leftAdornment}</View>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          {...rest}
        />
        {rightAdornment && <View style={styles.right}>{rightAdornment}</View>}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors'], hasError: boolean) =>
  StyleSheet.create({
    wrapper: { marginBottom: Spacing.md },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
    label: {
      color: colors.textSecondary,
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
    },
    optional: {
      color: colors.textMuted,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      marginLeft: Spacing.xs,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: hasError ? colors.error : colors.border,
      paddingHorizontal: Spacing.md,
      height: 52,
    },
    left: { marginRight: Spacing.sm },
    right: { marginLeft: Spacing.sm },
    input: {
      flex: 1,
      color: colors.text,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      paddingVertical: 0,
    },
    error: {
      marginTop: Spacing.xs,
      color: colors.error,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
    },
  });
