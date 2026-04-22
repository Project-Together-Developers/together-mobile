import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../theme/colors";
import { FontFamily, FontSize } from "../theme/typography";
import { Spacing, BorderRadius } from "../theme/spacing";
import { useAuthStore } from "../store/auth";
import { BottomTabParamList, RootStackParamList } from "../navigation/types";

type Props = BottomTabScreenProps<BottomTabParamList, "ProfileTab">;

export default function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

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
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.bold,
    color: Colors.text,
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
    color: Colors.textSecondary,
  },
  logoutBtn: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  logoutText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
});
