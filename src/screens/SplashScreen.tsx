import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/auth';
import { FontFamily, FontSize } from '../theme/typography';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        const { isAuthenticated } = useAuthStore.getState();
        navigation.replace(isAuthenticated ? 'Main' : 'Auth');
      }, 600);
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <Text style={styles.icon}>⛰</Text>
        <Text style={styles.title}>Together</Text>
        <Text style={styles.tagline}>{t('auth.tagline')}</Text>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center', gap: 12 },
  icon: { fontSize: 72, marginBottom: 8 },
  title: {
    fontSize: 42,
    fontFamily: FontFamily.bold,
    color: colors.accent,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
