import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useAppTheme } from '../theme/theme-provider';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface DateInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (next: string) => void;
  error?: string;
  optional?: boolean;
  labelIcon?: React.ReactNode;
  minimumDate?: Date;
  maximumDate?: Date;
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year || year < 1000) return undefined;
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function DateInput({
  label,
  value,
  placeholder,
  onChange,
  error,
  optional,
  labelIcon,
  minimumDate,
  maximumDate,
}: DateInputProps) {
  const { colors, mode } = useAppTheme();
  const [open, setOpen] = useState(false);
  const styles = React.useMemo(() => createStyles(colors, !!error), [colors, error]);

  const selectedDate = parseDate(value) ?? new Date();

  const handleChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (date) onChange(formatDate(date));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        {labelIcon && <View style={styles.labelIconWrap}>{labelIcon}</View>}
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}>·</Text>}
      </View>

      <TouchableOpacity style={styles.inputRow} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <View style={styles.right}>
          <Calendar size={18} color={colors.textMuted} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {Platform.OS === 'ios' ? (
        <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              themeVariant={mode === 'dark' ? 'dark' : 'light'}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={handleChange}
              style={styles.picker}
            />
            <TouchableOpacity style={styles.doneButton} onPress={() => setOpen(false)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : (
        open && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={handleChange}
          />
        )
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors'], hasError: boolean) =>
  StyleSheet.create({
    wrapper: { gap: Spacing.xs },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xs },
    labelIconWrap: { justifyContent: 'center' },
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
      alignItems: 'center',
      height: 52,
      backgroundColor: colors.input,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: hasError ? colors.error : colors.border,
      paddingHorizontal: Spacing.md,
    },
    valueText: {
      flex: 1,
      color: colors.text,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
    },
    placeholder: { color: colors.textMuted },
    right: { marginLeft: Spacing.sm },
    error: {
      marginTop: Spacing.xs,
      color: colors.error,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    sheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: BorderRadius.md,
      borderTopRightRadius: BorderRadius.md,
      alignItems: 'center',
      paddingBottom: Spacing.xl,
      paddingTop: Spacing.sm,
    },
    picker: { width: '100%' },
    doneButton: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
    },
    doneText: {
      color: colors.white,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.base,
    },
  });
