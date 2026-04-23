import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { sendOtp } from '../api/auth';
import { AuthErrorCode } from '../enums/auth-error-codes';
import { useAppTheme } from '../theme/theme-provider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const COUNTRY_CODE = '+998';

function formatUzPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
}

function getRawDigits(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const rawDigits = getRawDigits(phone);
  const isValid = rawDigits.length === 9;

  const handleChangePhone = (text: string) => {
    setPhone(formatUzPhone(text));
  };

  const handleGetCode = async () => {
    if (!isValid) {
      Alert.alert(t('common.error'), t(AuthErrorCode.INVALID_PHONE));
      return;
    }
    const fullPhone = `${COUNTRY_CODE}${rawDigits}`;
    setLoading(true);
    try {
      await sendOtp(fullPhone);
      navigation.navigate('VerifyOtp', { phone: fullPhone });
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      Alert.alert(t('common.error'), axiosErr?.response?.data?.error ?? t(AuthErrorCode.SEND_OTP_FAILED));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={styles.inner}>
        <Text style={styles.title}>{t('auth.welcome')}</Text>
        <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

        <View style={styles.telegramBanner}>
          <Text style={styles.telegramIcon}>✈️</Text>
          <Text style={styles.telegramText}>{t('auth.telegramHint')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryFlag}>🇺🇿</Text>
              <Text style={styles.countryCodeText}>{COUNTRY_CODE}</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="90 123 45 67"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={handleChangePhone}
              keyboardType="number-pad"
              autoComplete="tel"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
            onPress={handleGetCode}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>{t('auth.getCode')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: Spacing.base, justifyContent: 'center' },
  title: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  telegramBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3A5C',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#2A6DB5',
  },
  telegramIcon: { fontSize: 18 },
  telegramText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#89BADF',
  },
  form: { gap: Spacing.md },
  phoneRow: { flexDirection: 'row', gap: Spacing.sm },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.xs,
  },
  countryFlag: { fontSize: 18 },
  countryCodeText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});
