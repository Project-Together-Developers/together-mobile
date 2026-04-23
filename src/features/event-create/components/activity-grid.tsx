import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { IActivity } from '../types/event-interfaces';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { SvgUri } from 'react-native-svg';

interface ActivityGridProps {
  activities: IActivity[];
  loading: boolean;
  error: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onRetry: () => void;
  errorText: string;
}

const COLUMN_COUNT = 4;
const SKELETON_COUNT = 4;

export default function ActivityGrid({
  activities,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
  errorText,
}: ActivityGridProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (loading) {
    return (
      <View style={styles.skeletonGrid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <View key={i} style={[styles.cell, styles.skeleton]} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorText}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item._id}
      numColumns={COLUMN_COUNT}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 4 }}
      contentContainerStyle={{ gap: 4 }}
      renderItem={({ item }) => {
        const isSelected = item._id === selectedId;
        return (
          <TouchableOpacity
            style={[styles.cell, isSelected && { backgroundColor: `${colors.primary}33`, borderColor: colors.primary }]}
            onPress={() => onSelect(item._id)}
            activeOpacity={0.75}
          >
            <SvgUri
              width={24}
              height={24}
              uri={item.icon}
              stroke={isSelected ? colors.primary : colors.text}
            />
            <Text style={[styles.cellName, isSelected && { color: colors.primary }]} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    skeletonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    skeleton: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
      gap: Spacing.md,
    },
    errorText: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.error,
    },
    retryButton: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.primary,
    },
    retryText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.sm,
      color: colors.white,
    },
    cell: {
      flex: 1,
      margin: Spacing.xs / 2,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.md,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.xs,
      padding: Spacing.sm,
    },
    cellName: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.xs,
      fontWeight: 500,
      color: colors.text,
      textAlign: 'center',
    },
  });
