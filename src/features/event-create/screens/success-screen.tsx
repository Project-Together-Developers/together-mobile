import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CreateEventStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../../../theme/spacing';
import { useEventFormContext } from '../hooks/use-event-form';

type Props = NativeStackScreenProps<CreateEventStackParamList, 'CreateSuccess'>;

export default function SuccessScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { reset } = useEventFormContext();
  const { event } = route.params;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const formattedDate = new Date(event.dateFrom).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCreateAnother = () => {
    reset();
    navigation.replace('CreateStep1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.title}>{t('createEvent.successTitle')}</Text>
          <Text style={styles.subtitle}>{t('createEvent.successSubtitle')}</Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>{event.activityId.icon}</Text>
            <Text style={styles.detailText}>{event.activityId.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailText}>{event.spots}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createAnotherButton} onPress={handleCreateAnother} activeOpacity={0.85}>
          <Text style={styles.createAnotherText}>{t('createEvent.createAnother')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.base,
    },
    card: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: BorderRadius['2xl'],
      padding: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.md,
      ...Shadow.card,
    },
    checkmark: {
      fontSize: 48,
      color: colors.success,
    },
    title: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['2xl'],
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.border,
      marginVertical: Spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      alignSelf: 'flex-start',
    },
    detailIcon: {
      fontSize: 18,
    },
    detailText: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.base,
      color: colors.text,
    },
    footer: {
      padding: Spacing.base,
      paddingBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    createAnotherButton: {
      height: 52,
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createAnotherText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
      color: colors.primary,
    },
  });
