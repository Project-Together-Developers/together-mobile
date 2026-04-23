import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { Check, X } from "lucide-react-native";
import { RootStackParamList } from "../navigation/types";
import { useAppTheme } from "../theme/theme-provider";
import { FontFamily, FontSize } from "../theme/typography";
import { Spacing, BorderRadius } from "../theme/spacing";
import { useAuthStore } from "../store/auth";
import { Gender, CompleteProfilePayload } from "../interfaces/user";
import { checkUsername, completeProfile } from "../api/users";
import { validateUsername } from "../utils/validate-username";
import { validateBirthday } from "../utils/validate-birthday";
import { debounce } from "../utils/debounce";
import { UserErrorCode } from "../enums/user-error-codes";
import FormField from "../components/form-field";
import GenderSelector from "../components/gender-selector";
import AvatarPicker from "../components/avatar-picker";
import DateInput from "../components/date-input";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface AvatarAsset {
  uri: string;
  name: string;
  type: string;
}

export default function OnboardingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState<Gender | undefined>();
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState<AvatarAsset | undefined>();

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [firstnameError, setFirstnameError] = useState<string | undefined>();
  const [birthdayError, setBirthdayError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => true;
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [])
  );

  const runUsernameCheck = useRef(
    debounce(async (value: string) => {
      try {
        const { available } = await checkUsername(value);
        setUsernameStatus(available ? "available" : "taken");
        setUsernameError(
          available ? undefined : t(UserErrorCode.USERNAME_TAKEN)
        );
      } catch {
        setUsernameStatus("idle");
      }
    }, 400)
  ).current;

  useEffect(() => {
    return () => runUsernameCheck.cancel();
  }, [runUsernameCheck]);

  const handleUsernameChange = (text: string) => {
    const next = text.toLowerCase().replace(/\s+/g, "");
    setUsername(next);
    setSubmitError(undefined);
    runUsernameCheck.cancel();

    const validation = validateUsername(next);
    if (!validation.ok) {
      setUsernameStatus(next.length === 0 ? "idle" : "invalid");
      setUsernameError(next.length === 0 ? undefined : t(validation.code));
      return;
    }
    setUsernameError(undefined);
    setUsernameStatus("checking");
    runUsernameCheck(next);
  };

  const handleFirstnameChange = (text: string) => {
    setFirstname(text);
    setFirstnameError(undefined);
    setSubmitError(undefined);
  };

  const handleBirthdayChange = (next: string) => {
    setBirthday(next);
    setSubmitError(undefined);
    if (next.length === 0) {
      setBirthdayError(undefined);
      return;
    }
    if (next.length < 10) {
      setBirthdayError(undefined);
      return;
    }
    const validation = validateBirthday(next);
    setBirthdayError(validation.ok ? undefined : t(validation.code));
  };

  const canSubmit =
    !submitting &&
    firstname.trim().length > 0 &&
    usernameStatus === "available" &&
    (birthday.length === 0 || (birthday.length === 10 && !birthdayError));

  const handleSubmit = async () => {
    if (firstname.trim().length === 0) {
      setFirstnameError(t(UserErrorCode.FIRSTNAME_REQUIRED));
      return;
    }
    if (usernameStatus !== "available") return;

    const payload: CompleteProfilePayload = {
      username,
      firstname: firstname.trim(),
      lastname: lastname.trim() || undefined,
      gender,
      birthday: birthday.length === 10 ? birthday : undefined,
      avatar,
    };

    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const updatedUser = await completeProfile(payload);
      await setUser(updatedUser);
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setSubmitError(
        axiosErr?.response?.data?.error ?? t(UserErrorCode.GENERIC_ERROR)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderUsernameRightSlot = () => {
    if (usernameStatus === "checking") {
      return <ActivityIndicator size="small" color={colors.textMuted} />;
    }
    if (usernameStatus === "available") {
      return <Check size={18} color={colors.success} strokeWidth={2.4} />;
    }
    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      return <X size={18} color={colors.error} strokeWidth={2.4} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("onboarding.title")}</Text>
            <Text style={styles.subtitle}>{t("onboarding.subtitle")}</Text>
          </View>

          <AvatarPicker
            uri={avatar?.uri}
            onPick={setAvatar}
            hint={t("onboarding.avatarHint")}
            permissionDeniedMessage={t("onboarding.photoPermissionDenied")}
          />

          <FormField
            label={t("onboarding.usernameLabel")}
            value={username}
            onChangeText={handleUsernameChange}
            placeholder={t("onboarding.usernamePlaceholder")}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            leftAdornment={<Text style={styles.at}>@</Text>}
            rightAdornment={renderUsernameRightSlot()}
            error={usernameError}
          />

          <FormField
            label={t("onboarding.firstnameLabel")}
            value={firstname}
            onChangeText={handleFirstnameChange}
            placeholder={t("onboarding.firstnamePlaceholder")}
            autoCapitalize="words"
            maxLength={50}
            error={firstnameError}
          />

          <FormField
            label={t("onboarding.lastnameLabel")}
            value={lastname}
            onChangeText={setLastname}
            placeholder={t("onboarding.lastnamePlaceholder")}
            autoCapitalize="words"
            maxLength={50}
            optional
          />

          <GenderSelector
            label={t("onboarding.genderLabel")}
            value={gender}
            onChange={setGender}
            maleLabel={t("onboarding.genderMale")}
            femaleLabel={t("onboarding.genderFemale")}
          />

          <DateInput
            label={t("onboarding.birthdayLabel")}
            placeholder={t("onboarding.birthdayPlaceholder")}
            value={birthday}
            onChange={handleBirthdayChange}
            error={birthdayError}
            optional
          />

          {!!submitError && (
            <Text style={styles.submitError}>{submitError}</Text>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitText}>{t("onboarding.submit")}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    scroll: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing["3xl"],
    },
    header: { alignItems: "center", marginBottom: Spacing.xl },
    title: {
      fontSize: FontSize["2xl"],
      fontFamily: FontFamily.bold,
      color: colors.text,
      marginBottom: Spacing.xs,
      textAlign: "center",
    },
    subtitle: {
      fontSize: FontSize.base,
      fontFamily: FontFamily.regular,
      color: colors.textSecondary,
      textAlign: "center",
    },
    at: {
      color: colors.textMuted,
      fontFamily: FontFamily.medium,
      fontSize: FontSize.md,
    },
    submit: {
      marginTop: Spacing.lg,
      height: 56,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    submitDisabled: { opacity: 0.5 },
    submitText: {
      color: colors.white,
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.md,
    },
    submitError: {
      marginTop: Spacing.md,
      color: colors.error,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
      textAlign: "center",
    },
  });
