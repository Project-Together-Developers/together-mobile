import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { IEvent } from '../types/event';

interface EventCardProps {
  event: IEvent;
  onPress: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#4CAF84',
  medium: '#E8A438',
  pro: '#ee6438',
};

function formatDateRange(from: string, to: string | undefined, locale: string): string {
  const localeTag = locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'uz-UZ' : 'en-US';
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(localeTag, { day: 'numeric', month: 'short' }).format(d);
  const d1 = new Date(from);
  if (!to) return fmt(d1);
  return `${fmt(d1)} — ${fmt(new Date(to))}`;
}

function ActivityIcon({ icon, name, colors }: { icon: string; name: string; colors: any }) {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) {
    const letter = name?.[0]?.toUpperCase() ?? '?';
    return (
      <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: FontFamily.bold, fontSize: 18, color: colors.primary }}>{letter}</Text>
      </View>
    );
  }
  return (
    <SvgUri width={28} height={28} uri={icon} stroke={colors.primary} onError={() => setFailed(true)} />
  );
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const filled = event.spotsFilled + event.alreadyGoing;
  const progress = event.spots > 0 ? Math.min(filled / event.spots, 1) : 0;
  const isFull = filled >= event.spots;
  const diffColor = DIFFICULTY_COLORS[event.difficulty] ?? colors.primary;
  const diffLabel = t(`events.difficulty.${event.difficulty}`, { defaultValue: event.difficulty });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.top}>
        <View style={styles.iconWrap}>
          <ActivityIcon icon={event.activity.icon} name={event.activity.name} colors={colors} />
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{event.location}</Text>
            <View style={[styles.diffBadge, { backgroundColor: diffColor + '22' }]}>
              <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            <Calendar size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.date}>
              {formatDateRange(event.dateFrom, event.dateTo, i18n.language)}
            </Text>
          </View>

          {!!event.description && (
            <Text style={styles.desc} numberOfLines={2}>{event.description}</Text>
          )}
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.spotsRow}>
          <Text style={[styles.spotsText, isFull && styles.spotsTextFull]}>
            {isFull
              ? t('events.full')
              : t('events.going', { count: filled, total: event.spots })}
          </Text>
          <View style={styles.rightRow}>
            {!!event.budget && (
              <Text style={styles.price}>{event.budget.toLocaleString()} ₽</Text>
            )}
            <ChevronRight size={16} color={colors.textMuted} strokeWidth={2} />
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%` as any,
                backgroundColor: isFull ? colors.textMuted : colors.primary,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.xl,
      padding: Spacing.base,
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.sm,
      gap: Spacing.md,
    },
    top: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
      gap: 4,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    title: {
      flex: 1,
      fontFamily: FontFamily.bold,
      fontSize: FontSize.base,
      color: colors.text,
    },
    diffBadge: {
      borderRadius: BorderRadius.full,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    diffText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.xs,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    date: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    desc: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    bottom: {
      gap: 6,
    },
    spotsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    spotsText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.sm,
      color: colors.text,
    },
    spotsTextFull: {
      color: colors.textMuted,
    },
    rightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    price: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
  });
