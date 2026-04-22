import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../navigation/types';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { verifyOtp, sendOtp } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { AuthErrorCode } from '../enums/auth-error-codes';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60;

export default function OtpScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
  const { setTokens, setUser } = useAuthStore();

  const maskedPhone = phone.replace(/(\+\d{3})\d+(\d{2})$/, '$1*****$2');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = useCallback(
    async (fullCode: string) => {
      setLoading(true);
      setError('');
      try {
        const result = await verifyOtp(phone, fullCode);
        await setTokens(result.accessToken, result.refreshToken);
        await setUser(result.user);
        navigation
          .getParent<NativeStackNavigationProp<RootStackParamList>>()
          ?.navigate('Main');
      } catch (err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr?.response?.data?.error ?? t(AuthErrorCode.INVALID_CODE));
        setDigits(Array(OTP_LENGTH).fill(''));
        inputs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [phone, setTokens, setUser, t],
  );

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      const pasted = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      const newDigits = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((d, i) => { newDigits[i] = d; });
      setDigits(newDigits);
      setError('');
      const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputs.current[nextIndex]?.focus();
      if (pasted.length === OTP_LENGTH) handleVerify(pasted);
      return;
    }

    const digit = text.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');

    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
    if (newDigits.every((d) => d !== '')) handleVerify(newDigits.join(''));
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendOtp(phone);
      setResendTimer(RESEND_TIMEOUT);
      setDigits(Array(OTP_LENGTH).fill(''));
      setError('');
      inputs.current[0]?.focus();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      Alert.alert(t('common.error'), axiosErr?.response?.data?.error ?? t(AuthErrorCode.SEND_OTP_FAILED));
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.telegramIcon}>✈️</Text>
          <Text style={styles.title}>{t('auth.enterCode')}</Text>
          <Text style={styles.subtitle}>{t('auth.codeSentTo', { phone: maskedPhone })}</Text>
        </View>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              style={[
                styles.otpBox,
                !!error && styles.otpBoxError,
                !!digit && styles.otpBoxFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {loading && <ActivityIndicator style={styles.loader} color={colors.accent} size="large" />}

        <View style={styles.resendRow}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>{t('auth.resendIn', { seconds: resendTimer })}</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              {resending ? (
                <ActivityIndicator color={colors.accent} size="small" />
              ) : (
                <Text style={styles.resendBtn}>{t('auth.resendCode')}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },
  backBtn: { marginBottom: Spacing.xl },
  backText: {
    color: colors.textSecondary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  telegramIcon: { fontSize: 48, marginBottom: Spacing.md },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: colors.text,
  },
  otpBoxFilled: { borderColor: colors.accent },
  otpBoxError: { borderColor: colors.error },
  errorText: {
    color: colors.error,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  loader: { marginVertical: Spacing.lg },
  resendRow: { alignItems: 'center', marginTop: Spacing.xl },
  resendTimer: {
    color: colors.textSecondary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  resendBtn: {
    color: colors.accent,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
});
