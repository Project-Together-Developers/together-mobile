import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { FontFamily, FontSize } from "../theme/typography";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/theme-provider";

export default function EventsScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("events.title")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>{t("events.noEvents")}</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) => StyleSheet.create({
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
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
  },
});
