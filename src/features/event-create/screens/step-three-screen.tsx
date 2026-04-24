import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CreateEventStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/theme-provider';
import { FontFamily, FontSize } from '../../../theme/typography';
import { Spacing, BorderRadius } from '../../../theme/spacing';
import { useEventFormContext } from '../hooks/use-event-form';
import StepIndicator from '../components/step-indicator';
import FormField from '../../../components/form-field';
import { DollarSign, NotepadText } from 'lucide-react-native';

type Props = NativeStackScreenProps<CreateEventStackParamList, 'CreateStep3'>;

export default function StepThreeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { form, errors, submitting, setBudget, setDescription, submit } = useEventFormContext();

  const handlePublish = async () => {
    const event = await submit();
    if (event) {
      navigation.replace('CreateSuccess', { event });
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
          <StepIndicator totalSteps={3} currentStep={2} />
          <Text style={styles.title}>{t('createEvent.step3.title')}</Text>
          <Text style={styles.subtitle}>{t('createEvent.step3.subtitle')}</Text>
        </View>

        <FormField
          label={t('createEvent.budgetLabel')}
          labelIcon={<DollarSign size={14} color={colors.textSecondary} />}
          value={form.budget}
          onChangeText={setBudget}
          placeholder={t('createEvent.budgetPlaceholder')}
          keyboardType="numeric"
          optional
        />

        <FormField
          label={t('createEvent.descriptionLabel')}
          labelIcon={<NotepadText size={14} color={colors.textSecondary} />}
          value={form.description}
          onChangeText={setDescription}
          placeholder={t('createEvent.descriptionPlaceholder')}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          optional
        />

        {!!errors.submit && <Text style={styles.submitError}>{errors.submit}</Text>}
      </ScrollView>

      <Modal visible={submitting} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.overlayText}>{t('createEvent.publishing')}</Text>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.publishButton, submitting && styles.publishButtonDisabled]}
          onPress={handlePublish}
          activeOpacity={0.85}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.publishButtonText}>{t('createEvent.publish')}</Text>
          )}
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
      gap: Spacing.lg,
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
    submitError: {
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      color: colors.error,
      textAlign: 'center',
    },
    footer: {
      padding: Spacing.base,
      paddingBottom: Spacing.lg,
    },
    publishButton: {
      height: 52,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    publishButtonDisabled: {
      opacity: 0.6,
    },
    publishButtonText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
      color: colors.white,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
    },
    overlayText: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
      color: colors.white,
    },
  });
