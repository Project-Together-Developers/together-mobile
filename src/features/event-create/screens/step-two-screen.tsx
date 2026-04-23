import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CreateEventStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { useEventFormContext } from '../hooks/use-event-form';
import { EventDifficulty, EventTransport } from '../types/event-interfaces';
import StepIndicator from '../components/step-indicator';
import OptionSelector from '../components/option-selector';
import SpotsInput from '../components/spots-input';
import DateInput from '../../../components/date-input';
import { BusIcon, CalendarIcon, CarIcon, TruckIcon, UsersIcon } from 'lucide-react-native';
import { parseDDMMYYYYAny } from '../../../utils/format-date';

type Props = NativeStackScreenProps<CreateEventStackParamList, 'CreateStep2'>;

export default function StepTwoScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const {
    form,
    errors,
    setDateFrom,
    setDateTo,
    setDifficulty,
    setSpots,
    setAlreadyGoing,
    setTransport,
    validateStep2,
  } = useEventFormContext();

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minDateTo = React.useMemo(() => {
    const parsed = parseDDMMYYYYAny(form.dateFrom);
    return parsed ?? today;
  }, [form.dateFrom, today]);

  const difficultyOptions: { value: EventDifficulty; label: string }[] = [
    { value: 'beginner', label: t('createEvent.difficulty.beginner') },
    { value: 'medium', label: t('createEvent.difficulty.medium') },
    { value: 'pro', label: t('createEvent.difficulty.pro') },
  ];

  const transportOptions: { value: EventTransport; label: string, icon: (active: boolean) => React.ReactNode }[] = [
    { value: 'need-ride', label: t('createEvent.transport.needRide'), icon: (active) => <CarIcon color={active ? colors.white : colors.text} size={24} /> },
    { value: 'has-seats', label: t('createEvent.transport.hasSeats'), icon: (active) => <CarIcon color={active ? colors.white : colors.text} size={24} /> },
    { value: 'public', label: t('createEvent.transport.public'), icon: (active) => <BusIcon color={active ? colors.white : colors.text} size={24} /> },
  ];

  const handleNext = () => {
    if (validateStep2()) {
      navigation.navigate('CreateStep3');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'← ' + t('common.back')}</Text>
          </TouchableOpacity>
          <StepIndicator totalSteps={3} currentStep={1} />
          <Text style={styles.title}>{t('createEvent.step2.title')}</Text>
          <Text style={styles.subtitle}>{t('createEvent.step2.subtitle')}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <CalendarIcon size={14} color={colors.textSecondary} />
          <Text style={styles.sectionLabel}>{t('createEvent.tripDatesLabel')}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <DateInput
              label={t('createEvent.dateFromLabel')}
              value={form.dateFrom}
              placeholder={t('createEvent.datePlaceholder')}
              onChange={setDateFrom}
              error={errors.dateFrom}
              minimumDate={today}
            />
          </View>

          <View style={styles.col}>
            <DateInput
              label={t('createEvent.dateToLabel')}
              value={form.dateTo}
              placeholder={t('createEvent.datePlaceholder')}
              onChange={setDateTo}
              error={errors.dateTo}
              minimumDate={minDateTo}
              optional
            />
          </View>
        </View>

        <OptionSelector<EventDifficulty>
          label={t('createEvent.difficultyLabel')}
          options={difficultyOptions}
          value={form.difficulty}
          onChange={setDifficulty}
          error={errors.difficulty}
        />

        <View style={styles.sectionHeader}>
          <UsersIcon size={14} color={colors.textSecondary} />
          <Text style={styles.sectionLabel}>{t('createEvent.participantsLabel')}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <SpotsInput
              value={form.spots}
              onChange={setSpots}
              error={errors.spots}
            />
          </View>

          <View style={styles.col}>
            <SpotsInput
              label={t('createEvent.alreadyGoingLabel')}
              value={form.alreadyGoing}
              onChange={setAlreadyGoing}
              error={errors.alreadyGoing}
              minValue={0}
            />
          </View>
        </View>

        <OptionSelector<EventTransport>
          label={t('createEvent.transportLabel')}
          labelIcon={<TruckIcon size={14} color={colors.textSecondary} />}
          options={transportOptions}
          value={form.transport}
          onChange={setTransport}
          error={errors.transport}
          vertical
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>{t('createEvent.next')}</Text>
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
    content: {
      padding: Spacing.base,
      paddingBottom: Spacing.xl,
      gap: Spacing.md,
    },
    header: {
      gap: Spacing.sm,
    },
    backText: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      color: colors.primary,
      marginBottom: Spacing.xs,
    },
    title: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.xl,
      color: colors.text,
      marginTop: Spacing.xs,
    },
    subtitle: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textMuted,
    },
    footer: {
      padding: Spacing.base,
      paddingBottom: Spacing.lg,
    },
    nextButton: {
      height: 52,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextButtonText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
      color: colors.white,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: -Spacing.xs,
    },
    sectionLabel: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    col: {
      flex: 1,
    },
  });
