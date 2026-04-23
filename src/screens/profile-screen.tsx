import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontFamily, FontSize } from "../theme/typography";
import { Spacing, BorderRadius } from "../theme/spacing";
import { useAuthStore } from "../store/auth";
import { BottomTabParamList, RootStackParamList } from "../navigation/types";
import { useAppTheme } from "../theme/theme-provider";

type Props = BottomTabScreenProps<BottomTabParamList, "ProfileTab">;

export default function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const { colors, isDark, toggleTheme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleLogout = async () => {
    await logout();
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("profile.title")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Profile coming soon</Text>
        <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
          <Text style={styles.themeToggleIcon}>{isDark ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: FontSize["2xl"],
      fontFamily: FontFamily.bold,
      color: colors.text,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.lg,
    },
    placeholder: {
      fontSize: FontSize.base,
      fontFamily: FontFamily.regular,
      color: colors.textSecondary,
    },
    themeToggleBtn: {
      width: 52,
      height: 52,
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeToggleIcon: {
      fontSize: 24,
    },
    logoutBtn: {
      backgroundColor: colors.error,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    logoutText: {
      color: colors.white,
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.base,
    },
  });
