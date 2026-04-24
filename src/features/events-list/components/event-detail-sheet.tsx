import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  Alert,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { X, Calendar, Bus, MessageCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../../theme/theme-provider";
import { FontFamily, FontSize } from "../../../theme/typography";
import { Spacing, BorderRadius } from "../../../theme/spacing";
import { IEventUser } from "../types/event";
import { useEventDetail } from "../hooks/use-event-detail";
import { useEventJoin } from "../hooks/use-event-join";
import { useAuthStore } from "../../../store/auth";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#4CAF84",
  medium: "#E8A438",
  pro: "#ee6438",
};

function formatDateRange(from: string, to: string | undefined, locale: string): string {
  const localeTag = locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US";
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "short" }).format(d);
  const d1 = new Date(from);
  if (!to) return fmt(d1);
  return `${fmt(d1)} — ${fmt(new Date(to))}`;
}

function UserAvatar({ user, size = 36, colors }: { user: IEventUser; size?: number; colors: any }) {
  const initials =
    `${user?.firstname?.[0] ?? ""}${user?.lastname?.[0] ?? ""}`.toUpperCase() || "?";
  const bg = ["#E8A438", "#4CAF84", "#ee6438", "#C17B3F", "#5C8EE8"];
  const idx = (user?._id?.charCodeAt(0) ?? 0) % bg.length;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg[idx],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontFamily: FontFamily.semiBold, fontSize: size * 0.38, color: "#fff" }}>
        {initials}
      </Text>
    </View>
  );
}

function ActivityIconSheet({ icon, name, colors }: { icon: string; name: string; colors: any }) {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) {
    const letter = name?.[0]?.toUpperCase() ?? "?";
    return (
      <Text style={{ fontFamily: FontFamily.bold, fontSize: 22, color: colors.primary }}>{letter}</Text>
    );
  }
  return (
    <SvgUri width={36} height={36} uri={icon} stroke={colors.primary} onError={() => setFailed(true)} />
  );
}

interface EventDetailSheetProps {
  eventId: string | null;
  onClose: () => void;
  onRefetch?: () => void;
}

export default function EventDetailSheet({ eventId, onClose, onRefetch }: EventDetailSheetProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { event, loading, error, load } = useEventDetail();
  const { joining, toggle } = useEventJoin();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (eventId) {
      load(eventId);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      slideAnim.setValue(SHEET_HEIGHT);
    }
  }, [eventId]);

  const handleClose = () => {
    onRefetch?.();
    onClose();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 8,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) slideAnim.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 120) {
          Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, useNativeDriver: true, duration: 220 }).start(handleClose);
        } else {
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
        }
      },
    }),
  ).current;

  if (!eventId) return null;

  const ev = event;
  const isOrganizer = !!ev && ev.organizer._id === currentUserId;
  const isJoined =
    !isOrganizer && (ev?.participants?.some((p) => p.user._id === currentUserId) ?? false);
  const filled = ev ? ev.spotsFilled + ev.alreadyGoing : 0;
  const progress = ev && ev.spots > 0 ? Math.min(filled / ev.spots, 1) : 0;
  const diffColor = ev ? (DIFFICULTY_COLORS[ev.difficulty] ?? colors.primary) : colors.primary;
  const diffLabel = ev ? t(`events.difficulty.${ev.difficulty}`, { defaultValue: ev.difficulty }) : "";

  const handleJoin = async () => {
    if (!ev) return;
    try {
      await toggle(ev._id, isJoined);
      load(ev._id);
      onRefetch?.();
    } catch (err: any) {
      const msg: string = err?.response?.data?.error ?? t("common.error");
      Alert.alert("", msg);
    }
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.dragHandle} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading && (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          )}
          {!loading && error && !ev && (
            <View style={styles.center}>
              <Text style={styles.errorText}>{t("common.error")}</Text>
            </View>
          )}

          {!loading && ev && (
            <>
              <View style={styles.header}>
                <View style={styles.activityIcon}>
                  <ActivityIconSheet icon={ev.activity.icon} name={ev.activity.name} colors={colors} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.eventTitle}>{ev.location}</Text>
                  <Text style={styles.eventSubtitle}>{ev.activity.name}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.75}>
                  <X size={16} color={colors.textSecondary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Calendar size={13} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {formatDateRange(ev.dateFrom, ev.dateTo, i18n.language)}
                  </Text>
                </View>
                <View style={[styles.diffChip, { backgroundColor: diffColor + "22" }]}>
                  <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Bus size={13} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.metaText}>
                    {t(`events.transport.${ev.transport}`, { defaultValue: ev.transport })}
                  </Text>
                </View>
                {!!ev.budget && (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaText}>{ev.budget.toLocaleString()} ₽</Text>
                  </View>
                )}
              </View>

              {!!ev.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>{t("events.sectionDescription")}</Text>
                  <Text style={styles.description}>{ev.description}</Text>
                </View>
              )}

              <View style={styles.infoCards}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardLabel}>{t("events.sectionOrganizer")}</Text>
                  <View style={styles.organizerRow}>
                    <UserAvatar user={ev.organizer} size={32} colors={colors} />
                    <Text style={styles.organizerName}>
                      {ev.organizer?.firstname}{" "}
                      {ev.organizer?.lastname?.[0] ? ev.organizer.lastname[0] + "." : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardLabel}>{t("events.sectionParticipants")}</Text>
                  <Text style={styles.participantsCount}>
                    {filled}
                    <Text style={styles.participantsTotal}>/{ev.spots}</Text>
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
                  </View>
                </View>
              </View>

              {(ev.participants ?? []).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    {t("events.sectionGoing", { count: filled })}
                  </Text>
                  <View style={styles.participantsList}>
                    {(ev.participants ?? []).filter((p) => p.user._id !== ev.organizer._id).map((p) => {
                      const isMe = p.user._id === currentUserId;
                      return (
                        <View key={p._id} style={styles.participantRow}>
                          <UserAvatar user={p.user} size={40} colors={colors} />
                          <View style={styles.participantInfo}>
                            <Text style={[styles.participantName, isMe && { color: colors.primary }]}>
                              {isMe
                                ? t("events.you")
                                : `${p.user?.firstname ?? ""} ${p.user?.lastname?.[0] ? p.user.lastname[0] + "." : ""}`.trim()}
                            </Text>
                            {isMe ? (
                              <Text style={[styles.participantSub, { color: colors.primary }]}>
                                {t("events.justJoined")}
                              </Text>
                            ) : p.user.username ? (
                              <Text style={styles.participantSub}>@{p.user.username}</Text>
                            ) : null}
                          </View>
                          {isMe && (
                            <View style={styles.checkMark}>
                              <Text style={{ color: colors.success, fontSize: 16 }}>✓</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {!loading && event && (
          <View style={styles.footer}>
            {isOrganizer || isJoined ? (
              <TouchableOpacity style={styles.chatBtn} activeOpacity={0.85}>
                <MessageCircle size={18} color={colors.primary} strokeWidth={2} />
                <Text style={styles.chatBtnText}>{t("events.openGroupChat")}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.joinBtn, joining && styles.joinBtnDisabled]}
                onPress={handleJoin}
                activeOpacity={0.85}
                disabled={joining}
              >
                <Text style={styles.joinBtnText}>
                  {joining ? t("common.loading") : t("events.joinEvent")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
    sheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: SHEET_HEIGHT,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    dragHandle: { paddingTop: 12, paddingBottom: 4, alignItems: "center" },
    handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border },
    scroll: { flex: 1 },
    scrollContent: { padding: Spacing.base, paddingBottom: Spacing.xl, gap: Spacing.base },
    center: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    errorText: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: colors.error },
    header: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
    activityIcon: {
      width: 52,
      height: 52,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: { flex: 1, gap: 4 },
    eventTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md, color: colors.text },
    eventSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: colors.textSecondary },
    closeBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },
    metaRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: BorderRadius.full,
      backgroundColor: colors.input,
    },
    metaText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: colors.textSecondary },
    diffChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
    diffText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
    section: { gap: Spacing.sm },
    sectionLabel: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.xs,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    description: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: colors.text, lineHeight: 22 },
    infoCards: { flexDirection: "row", gap: Spacing.sm },
    infoCard: {
      flex: 1,
      backgroundColor: colors.input,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    infoCardLabel: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSize.xs,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    organizerRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
    organizerName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: colors.text },
    participantsCount: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: colors.text },
    participantsTotal: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: colors.textSecondary },
    progressTrack: { height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 2, backgroundColor: colors.primary },
    participantsList: { gap: Spacing.sm },
    participantRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
    participantInfo: { flex: 1, gap: 2 },
    participantName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: colors.text },
    participantSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: colors.textSecondary },
    checkMark: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
    footer: { padding: Spacing.base, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.border },
    joinBtn: {
      height: 52,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    joinBtnDisabled: { opacity: 0.6 },
    joinBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: colors.white },
    chatBtn: {
      height: 52,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.primary + "18",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
    },
    chatBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: colors.primary },
  });
