
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { COLORS, SPACING, RADIUS } from "../../../theme/colors";

import {
  shareBackupFile,
  pickBackupFile,
  BackupPayload,
} from "../../../services/backupService";

type Props = {
  onBack: () => void;
  onRestore: (backup: BackupPayload) => Promise<void>;
};

export default function SettingsScreen({ onBack, onRestore }: Props) {
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    try {
      setBusy(true);
      await shareBackupFile();

      Alert.alert(
        "Backup ready",
        "Your APEX backup has been prepared. Save or share the JSON file.",
      );
    } catch (error) {
      Alert.alert(
        "Backup failed",
        error instanceof Error
          ? error.message
          : "Could not create your backup.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    try {
      const backup = await pickBackupFile();

      if (!backup) return;

      Alert.alert(
        "Restore backup?",
        "This will replace your current routines, workout history and custom exercises with the selected backup. This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              try {
                setBusy(true);
                await onRestore(backup);

                Alert.alert(
                  "Restore complete",
                  "Your APEX data has been restored successfully.",
                  [{ text: "Done", onPress: onBack }],
                );
              } catch (error) {
                Alert.alert(
                  "Restore failed",
                  error instanceof Error
                    ? error.message
                    : "Could not restore your backup.",
                );
              } finally {
                setBusy(false);
              }
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Import failed",
        error instanceof Error
          ? error.message
          : "Could not read the selected backup.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>MANAGE YOUR APEX APP</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introTitle}>Your data. Your control.</Text>
          <Text style={styles.introDescription}>
            Keep your workout progress safe with local backups.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>DATA & BACKUP</Text>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>↑</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Export backup</Text>
            <Text style={styles.cardDescription}>
              Save routines, workout history and custom exercises.
            </Text>
          </View>

          <Pressable
            disabled={busy}
            onPress={handleExport}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
              busy && styles.disabled,
            ]}
          >
            <Text style={styles.actionText}>EXPORT</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>↓</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Import backup</Text>
            <Text style={styles.cardDescription}>
              Restore your data from a previous APEX JSON backup.
            </Text>
          </View>

          <Pressable
            disabled={busy}
            onPress={handleImport}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
              busy && styles.disabled,
            ]}
          >
            <Text style={styles.actionText}>IMPORT</Text>
          </Pressable>
        </View>

        {busy && (
          <View style={styles.busyRow}>
            <ActivityIndicator color={COLORS.green} />
            <Text style={styles.busyText}>Processing your data...</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>OFFLINE FIRST</Text>
          <Text style={styles.infoDescription}>
            Your workouts are stored locally on this device. Daily tracking
            does not require an internet connection.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            APEX<Text style={styles.footerDot}>.</Text>
          </Text>
          <Text style={styles.footerVersion}>VERSION 1.0.0</Text>
          <Text style={styles.footerCaption}>
            BUILT BY DISCIPLINE.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: COLORS.green,
    fontSize: 34,
    lineHeight: 38,
    marginTop: -4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.7,
    marginTop: 3,
  },
  intro: {
    marginBottom: SPACING.xxl,
  },
  introTitle: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: "900",
    marginBottom: SPACING.sm,
  },
  introDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },
  sectionLabel: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardIcon: {
    width: 39,
    height: 39,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "900",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardDescription: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 15,
  },
  actionButton: {
    backgroundColor: COLORS.greenDark,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#526D30",
  },
  actionText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.4,
  },
  busyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  busyText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  infoTitle: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: SPACING.sm,
  },
  infoDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 19,
  },
  footer: {
    alignItems: "center",
    marginTop: 48,
    gap: 5,
  },
  footerLogo: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
  },
  footerDot: {
    color: COLORS.green,
  },
  footerVersion: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footerCaption: {
    color: COLORS.textSecondary,
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 3,
  },
});
