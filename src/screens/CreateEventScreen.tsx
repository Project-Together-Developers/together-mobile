import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "../theme/colors";
import { FontFamily, FontSize } from "../theme/typography";
import { Spacing } from "../theme/spacing";

export default function CreateEventScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("createEvent.title")}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Create event form coming soon</Text>
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
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
});
