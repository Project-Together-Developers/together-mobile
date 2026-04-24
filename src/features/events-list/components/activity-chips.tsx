import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { IEventActivity } from '../types/event';

interface ActivityChipsProps {
  activities: IEventActivity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function ActivityChips({ activities, selectedId, onSelect }: ActivityChipsProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[styles.chip, selectedId === null && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.75}
      >
        <Text style={[styles.label, selectedId === null && styles.labelActive]}>{t('events.filterAll')}</Text>
      </TouchableOpacity>
      {activities.map((a) => (
        <TouchableOpacity
          key={a._id}
          style={[styles.chip, selectedId === a._id && styles.chipActive]}
          onPress={() => onSelect(a._id)}
          activeOpacity={0.75}
        >
          <Text style={[styles.label, selectedId === a._id && styles.labelActive]}>{a.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: Spacing.base,
      gap: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    chip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 7,
      borderRadius: BorderRadius.full,
      backgroundColor: colors.input,
    },
    chipActive: {
      backgroundColor: colors.primary,
    },
    label: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.white,
      fontFamily: FontFamily.semiBold,
    },
  });
