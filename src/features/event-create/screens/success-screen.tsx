import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
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
import { Check } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CreateEventStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../../../theme/spacing';

type Props = NativeStackScreenProps<CreateEventStackParamList, 'CreateSuccess'>;

export default function SuccessScreen({ route }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { event } = route.params;
  const [iconLoaded, setIconLoaded] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const circleScale = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 450 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 100 });
    circleScale.value = withSpring(1, { damping: 12, stiffness: 110 });
  }, []);

  const contentAnimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const circleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const formattedDate = new Date(event.dateFrom).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroSection, contentAnimStyle]}>
          <Animated.View style={[styles.checkCircle, circleAnimStyle]}>
            <Check size={44} color={colors.primary} strokeWidth={2.5} />
          </Animated.View>
          <Text style={styles.title}>{t('createEvent.successTitle')}</Text>
          <Text style={styles.subtitle}>{t('createEvent.successSubtitle')}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, contentAnimStyle]}>
          <View style={styles.cardTop}>
            <View style={styles.iconBox}>
              {!iconLoaded && <View style={styles.iconSkeleton} />}
              <SvgUri
                width={32}
                height={32}
                uri={event.activity.icon}
                onLoad={() => setIconLoaded(true)}
                style={iconLoaded ? undefined : { position: 'absolute', opacity: 0 }}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{event.activity.name}</Text>
              <Text style={styles.cardMeta}>
                {formattedDate} · {event.spots} {t('createEvent.spotsLabel').toLowerCase()}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardBottom}>
            <Text style={styles.participantsText}>
              {t('createEvent.successParticipants', { current: 1, total: event.spots })}
            </Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{t('createEvent.activeStatus')}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={contentAnimStyle}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.shareLink}>{t('createEvent.shareLink')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      padding: Spacing.base,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing['2xl'],
    },
    heroSection: {
      alignItems: 'center',
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
    },
    checkCircle: {
      width: 120,
      height: 120,
      borderRadius: BorderRadius.full,
      backgroundColor: `${colors.primary}1a`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
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
      lineHeight: 22,
    },
    card: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: BorderRadius['2xl'],
      padding: Spacing.base,
      ...Shadow.card,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingBottom: Spacing.base,
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: BorderRadius.lg,
      backgroundColor: `${colors.primary}1a`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconSkeleton: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.border,
    },
    cardInfo: {
      flex: 1,
      gap: Spacing.xs,
    },
    cardTitle: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
      color: colors.text,
    },
    cardMeta: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    cardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.base,
    },
    participantsText: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      color: colors.textSecondary,
    },
    activeBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
      backgroundColor: `${colors.primary}1a`,
    },
    activeBadgeText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.sm,
      color: colors.primary,
    },
    shareLink: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
