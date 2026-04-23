import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-provider';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  labelIcon?: React.ReactNode;
  optional?: boolean;
  unified?: boolean;
}

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  leftAdornment,
  rightAdornment,
  labelIcon,
  optional,
  unified = false,
  multiline,
  ...rest
}: FormFieldProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors, !!error, unified, !!multiline), [colors, error, unified, multiline]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        {labelIcon && <View style={styles.labelIconWrap}>{labelIcon}</View>}
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
          textAlign={unified ? 'center' : undefined}
          multiline={multiline}
          {...rest}
        />
        {rightAdornment && <View style={styles.right}>{rightAdornment}</View>}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors'], hasError: boolean, unified: boolean, isMultiline: boolean) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: Spacing.md,
      ...(unified && {
        backgroundColor: colors.input,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: hasError ? colors.error : colors.border,
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
      }),
    },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xs },
    labelIconWrap: { justifyContent: 'center', paddingTop: 2 },
    label: {
      color: colors.textSecondary,
      fontFamily: FontFamily.bold,
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
      alignItems: isMultiline ? 'flex-start' : 'center',
      ...(isMultiline ? {} : { height: 36 }),
      ...(unified
        ? { backgroundColor: 'transparent' }
        : {
          backgroundColor: colors.input,
          borderRadius: BorderRadius.md,
          borderWidth: 1.5,
          borderColor: hasError ? colors.error : colors.border,
          paddingHorizontal: Spacing.md,
          ...(isMultiline ? { minHeight: 52, paddingVertical: Spacing.sm } : { height: 52 }),
        }),
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
