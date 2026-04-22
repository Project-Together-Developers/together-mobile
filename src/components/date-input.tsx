import React from 'react';
import { Calendar } from 'lucide-react-native';
import FormField from './form-field';
import { maskDateInput } from '../utils/format-date';
import { useAppTheme } from '../theme/ThemeProvider';

interface DateInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (next: string) => void;
  error?: string;
  optional?: boolean;
}

export default function DateInput({
  label,
  value,
  placeholder,
  onChange,
  error,
  optional,
}: DateInputProps) {
  const { colors } = useAppTheme();
  return (
    <FormField
      label={label}
      value={value}
      onChangeText={(text) => onChange(maskDateInput(text))}
      placeholder={placeholder}
      keyboardType="number-pad"
      error={error}
      optional={optional}
      maxLength={10}
      rightAdornment={<Calendar size={18} color={colors.textMuted} strokeWidth={2} />}
    />
  );
}
