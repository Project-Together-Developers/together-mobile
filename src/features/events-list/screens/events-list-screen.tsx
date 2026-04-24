import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { useEvents } from '../hooks/use-events';
import { useMyEvents } from '../hooks/use-my-events';
import { useActivities } from '../../event-create/hooks/use-activities';
import { IEvent, EventTabFilter } from '../types/event';
import EventCard from '../components/event-card';
import FilterTabs from '../components/filter-tabs';
import ActivityChips from '../components/activity-chips';
import EventDetailSheet from '../components/event-detail-sheet';

export default function EventsListScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const { events, loading, error, retry } = useEvents();
  const { events: myEvents, loading: myLoading, error: myError, load: loadMyEvents } = useMyEvents();
  const { activities } = useActivities();

  const [tab, setTab] = useState<EventTabFilter>('active');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (tab === 'my') {
      loadMyEvents();
    }
  }, [tab]);

  const now = new Date();

  const baseList: IEvent[] = tab === 'my' ? myEvents : events;
  const isLoading = tab === 'my' ? myLoading : loading;
  const hasError = tab === 'my' ? myError : error;

  const filtered = useMemo(() => {
    let list = baseList;

    if (tab === 'active') {
      list = list.filter((e) => new Date(e.dateFrom) >= now);
    } else if (tab === 'past') {
      list = list.filter((e) => new Date(e.dateFrom) < now);
    }

    if (selectedActivity) {
      list = list.filter((e) => e.activity._id === selectedActivity);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.location.toLowerCase().includes(q) ||
          e.activity.name.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [baseList, tab, selectedActivity, search]);

  const uniqueActivities = useMemo(() => {
    const seen = new Set<string>();
    return activities.filter((a) => {
      if (seen.has(a._id)) return false;
      seen.add(a._id);
      return true;
    });
  }, [activities]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('events.title')}</Text>
      </View>

      <View style={styles.filters}>
        <FilterTabs active={tab} onChange={setTab} />

        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t('events.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <ActivityChips
          activities={uniqueActivities as any}
          selectedId={selectedActivity}
          onSelect={setSelectedActivity}
        />
      </View>

      {isLoading && baseList.length === 0 && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {hasError && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{t('common.error')}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={retry} activeOpacity={0.75}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !hasError && filtered.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t('events.noEvents')}</Text>
        </View>
      )}

      <FlatList<IEvent>
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => setSelectedEventId(item._id)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && baseList.length > 0}
            onRefresh={() => {
              retry();
              if (tab === 'my') loadMyEvents();
            }}
            tintColor={colors.primary}
          />
        }
      />

      <EventDetailSheet
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onRefetch={() => {
          retry();
          if (tab === 'my') loadMyEvents();
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
    },
    title: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize['2xl'],
      color: colors.text,
    },
    filters: {
      gap: Spacing.md,
      paddingBottom: Spacing.md,
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.base,
      backgroundColor: colors.input,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      height: 44,
      gap: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.text,
    },
    listContent: {
      paddingTop: Spacing.sm,
      paddingBottom: 80,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
    },
    errorText: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      color: colors.error,
    },
    emptyText: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.base,
      color: colors.textSecondary,
    },
    retryBtn: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary,
    },
    retryText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.sm,
      color: colors.white,
    },
  });
