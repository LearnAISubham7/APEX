
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

import CelebrationOverlay from "../../../components/CelebrationOverlay";

import {
  Exercise,
  getTodayName,
} from "../../../types/routine";

import { COLORS } from "../../../theme/colors";

type Props = {
  exercises: Exercise[];
  onToggle: (id: string) => void;
  onEditPlan: () => void;
  onOpenSettings: () => void;
};

export default function TodayScreen({
  exercises,
  onToggle,
  onEditPlan,
  onOpenSettings
}: Props) {
  const completed = exercises.filter(
    (exercise) => exercise.completed
  ).length;

  const progress =
    exercises.length > 0 ? completed / exercises.length : 0;

  const progressPercent = Math.round(progress * 100);

  const allCompleted =
    exercises.length > 0 && completed === exercises.length;

  const today = getTodayName();

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const animatedProgress = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
  const animation = Animated.timing(animatedProgress, {
    toValue: progress,
    duration: 650,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  });

  animation.start();

  return () => {
    animation.stop();
  };
}, [progress, animatedProgress]);

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.screen}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            APEX<Text style={styles.logoDot}>.</Text>
          </Text>
          <Text style={styles.tagline}>
            BUILT BY DISCIPLINE.
          </Text>
        </View>

        <Pressable
  onPress={onOpenSettings}
  style={({ pressed }) => [
    styles.avatar,
    pressed && styles.pressedButton,
  ]}
  accessibilityRole="button"
  accessibilityLabel="Open settings"
>
  <Text style={styles.avatarText}>⚙</Text>
</Pressable>
      </View>

      {/* GREETING */}
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>
          {today.toUpperCase()} · {date.toUpperCase()}
        </Text>

        <Text style={styles.heading}>
          Make today
        </Text>

        <Text style={styles.headingGreen}>
          count.
        </Text>

        <Text style={styles.subtitle}>
          Small progress. Every single day.
        </Text>
      </View>

      {/* PROGRESS CARD */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Text style={styles.cardLabel}>
            DAILY PROGRESS
          </Text>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              TODAY
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressNumber}>
              {progressPercent}%
            </Text>

            <Text style={styles.muted}>
              {completed} of {exercises.length} completed
            </Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.circleNumber}>
              {completed}/{exercises.length}
            </Text>
            <Text style={styles.circleLabel}>
              DONE
            </Text>
          </View>
        </View>

        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              { width: progressWidth },
            ]}
          />
        </View>

        <Text style={styles.progressFooter}>
          {allCompleted
            ? "EVERY REP COUNTS. YOU DID IT."
            : completed === 0
              ? "YOUR NEXT REP STARTS HERE."
              : "KEEP MOVING FORWARD."}
        </Text>
      </View>

      {/* WORKOUT SECTION */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Today's workout
          </Text>

          <Text style={styles.muted}>
            Your plan. Your pace. Your rules.
          </Text>
        </View>

        <Pressable
          onPress={onEditPlan}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.editButtonText}>
            EDIT PLAN
          </Text>
        </Pressable>
      </View>

      {/* EMPTY STATE */}
      {exercises.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>＋</Text>
          </View>

          <Text style={styles.emptyTitle}>
            Nothing planned yet
          </Text>

          <Text style={styles.emptyDescription}>
            Build your routine and give today a purpose.
          </Text>

          <Pressable
            onPress={onEditPlan}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.primaryText}>
              BUILD YOUR ROUTINE
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <Pressable
              key={exercise.id}
              onPress={() => onToggle(exercise.id)}
              style={({ pressed }) => [
                styles.exerciseCard,
                exercise.completed && styles.completedCard,
                pressed && styles.exercisePressed,
              ]}
            >
              <View
                style={[
                  styles.exerciseIcon,
                  exercise.completed && styles.completedIcon,
                ]}
              >
                <Text
                  style={[
                    styles.iconText,
                    exercise.completed &&
                      styles.completedIconText,
                  ]}
                >
                  {exercise.completed ? "✓" : "↗"}
                </Text>
              </View>

              <View style={styles.exerciseInfo}>
                <Text style={styles.category}>
                  {exercise.category.toUpperCase()}
                </Text>

                <Text
                  style={styles.exerciseName}
                  numberOfLines={1}
                >
                  {exercise.name}
                </Text>

                <Text
                  style={styles.exerciseDetail}
                  numberOfLines={1}
                >
                  {exercise.detail}
                </Text>
              </View>

              <View style={styles.exerciseRight}>
                <Text style={styles.target}>
                  {exercise.target}
                </Text>

                <View
                  style={[
                    styles.checkbox,
                    exercise.completed &&
                      styles.checkboxDone,
                  ]}
                >
                  {exercise.completed && (
                    <Text style={styles.tick}>✓</Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* COMPLETION CELEBRATION */}
      {allCompleted && (
        <View style={styles.success}>
          <Text style={styles.flower}>
            ✦ ✿ ✦
          </Text>

          <Text style={styles.successTitle}>
            WORKOUT COMPLETE!
          </Text>

          <Text style={styles.successDescription}>
            You kept your promise to yourself.
          </Text>

          <Text style={styles.successSmall}>
            SHOW UP. PUT IN THE WORK. REPEAT.
          </Text>
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
     {allCompleted && <CelebrationOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
  flex: 1,
  position: "relative",
},
  container: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 3,
  },

  logoDot: {
    color: COLORS.green,
  },

  tagline: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 2,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#20271A",
    borderWidth: 1,
    borderColor: "#465A2C",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "800",
  },

  intro: {
    marginBottom: 24,
  },

  eyebrow: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  heading: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 43,
  },

  headingGreen: {
    color: COLORS.green,
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 47,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },

  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 32,
  },

  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },

  liveText: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 14,
  },

  progressInfo: {
    flex: 1,
  },

  progressNumber: {
    color: COLORS.text,
    fontSize: 43,
    fontWeight: "900",
  },

  muted: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  progressCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: COLORS.green,
    backgroundColor: "#1B2414",
    justifyContent: "center",
    alignItems: "center",
  },

  circleNumber: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "900",
  },

  circleLabel: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "800",
    marginTop: 2,
  },

  track: {
    height: 7,
    borderRadius: 10,
    backgroundColor: "#30352D",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 10,
  },

  progressFooter: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionHeading: {
    flex: 1,
    marginRight: 8,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 5,
  },

  editButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#526D30",
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  editButtonText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
  },

  pressedButton: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  exerciseList: {
    gap: 11,
  },

  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    minHeight: 86,
  },

  exercisePressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  completedCard: {
    borderColor: "#526D30",
    backgroundColor: "#172014",
  },

  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#23291F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  completedIcon: {
    backgroundColor: COLORS.green,
  },

  iconText: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "900",
  },

  completedIconText: {
    color: COLORS.background,
  },

  exerciseInfo: {
    flex: 1,
    minWidth: 0,
  },

  category: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  exerciseName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  exerciseDetail: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },

  exerciseRight: {
  alignItems: "flex-end",
  gap: 8,
  marginLeft: 8,
  minWidth: 42,
},

  target: {
  color: COLORS.text,
  fontSize: 11,
  fontWeight: "900",
  textAlign: "right",
},

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#586052",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxDone: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  tick: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "900",
  },

  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#20271A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyIcon: {
    color: COLORS.green,
    fontSize: 34,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 7,
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
  },

  primaryButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },

  primaryText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: "900",
  },

  success: {
    backgroundColor: "#182016",
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.green,
    gap: 9,
  },

  flower: {
    color: COLORS.green,
    fontSize: 30,
  },

  successTitle: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: "900",
  },

  successDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  successSmall: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 5,
  },

  bottomSpace: {
    height: 12,
  },
});
