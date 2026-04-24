import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { EventTabFilter } from '../types/event';

interface FilterTabsProps {
  active: EventTabFilter;
  onChange: (tab: EventTabFilter) => void;
}

const TABS: { key: EventTabFilter; i18nKey: string }[] = [
  { key: 'active', i18nKey: 'events.tabActive' },
  { key: 'past', i18nKey: 'events.tabPast' },
  { key: 'my', i18nKey: 'events.tabMy' },
];

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {TABS.map(({ key, i18nKey }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{t(i18nKey)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.base,
      gap: Spacing.sm,
    },
    tab: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary + '18',
      borderColor: colors.primary,
    },
    label: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.primary,
      fontFamily: FontFamily.semiBold,
    },
  });
