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
import { useActivities } from '../hooks/use-activities';
import StepIndicator from '../components/step-indicator';
import ActivityGrid from '../components/activity-grid';
import FormField from '../../../components/form-field';

type Props = NativeStackScreenProps<CreateEventStackParamList, 'CreateStep1'>;

export default function StepOneScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { form, errors, setActivityId, setLocation, validateStep1 } = useEventFormContext();
  const { activities, loading, error, retry } = useActivities();

  const handleNext = () => {
    if (validateStep1()) {
      navigation.navigate('CreateStep2');
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
          <StepIndicator totalSteps={3} currentStep={0} />
          <Text style={styles.title}>{t('createEvent.step1.title')}</Text>
          <Text style={styles.subtitle}>{t('createEvent.step1.subtitle')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('createEvent.activityLabel')}</Text>
          <ActivityGrid
            activities={activities}
            loading={loading}
            error={error}
            selectedId={form.activityId}
            onSelect={setActivityId}
            onRetry={retry}
            errorText={t('createEvent.activitiesLoadError')}
          />
          {!!errors.activityId && <Text style={styles.fieldError}>{errors.activityId}</Text>}
        </View>

        <View style={styles.section}>
          <FormField
            label={t('createEvent.locationLabel')}
            value={form.location}
            onChangeText={setLocation}
            placeholder={t('createEvent.locationPlaceholder')}
            error={errors.location}
            returnKeyType="done"
          />
        </View>
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
      gap: Spacing.xl,
    },
    header: {
      gap: Spacing.sm,
    },
    title: {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.xl,
      color: colors.text,
      marginTop: Spacing.sm,
    },
    subtitle: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.textMuted,
    },
    section: {
      gap: Spacing.sm,
    },
    sectionLabel: {
      fontFamily: FontFamily.medium,
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    fieldError: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.xs,
      color: colors.error,
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
  });
