
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Exercise } from "../../../types/routine";
import { WorkoutDayRecord } from "../../../types/history";
import { COLORS } from "../../../theme/colors";

type Props = {
  totalExercises: number;
  todayExercises: Exercise[];
  history: WorkoutDayRecord[];
};

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getActiveDates(history: WorkoutDayRecord[]): Set<string> {
  return new Set(
    history
      .filter((record) =>
        record.exercises.some((exercise) => exercise.completed),
      )
      .map((record) => record.date),
  );
}

function calculateStreak(activeDates: Set<string>): number {
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // A streak remains alive if the last workout was yesterday.
  if (!activeDates.has(getDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);

    if (!activeDates.has(getDateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;

  while (activeDates.has(getDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function StatsScreen({
  totalExercises,
  todayExercises,
  history,
}: Props) {
  const todayCompleted = todayExercises.filter(
    (exercise) => exercise.completed,
  ).length;

  const todayProgress = todayExercises.length
    ? Math.round(
        (todayCompleted / todayExercises.length) * 100,
      )
    : 0;

  const stats = useMemo(() => {
    const activeDates = getActiveDates(history);

    const totalCompleted = history.reduce(
      (total, record) =>
        total +
        record.exercises.filter((exercise) => exercise.completed).length,
      0,
    );

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const monday = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dayOfWeek);

    const week = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      const dateKey = getDateKey(date);
      const record = history.find(
        (item) => item.date === dateKey,
      );

      const completedCount =
        record?.exercises.filter((exercise) => exercise.completed)
          .length ?? 0;

      return {
        date: dateKey,
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }).slice(0, 1),
        completedCount,
      };
    });

    return {
      activeDays: activeDates.size,
      totalCompleted,
      streak: calculateStreak(activeDates),
      week,
      weeklyActiveDays: week.filter(
        (day) => day.completedCount > 0,
      ).length,
    };
  }, [history]);

  const maxWeeklyCount = Math.max(
    1,
    ...stats.week.map((day) => day.completedCount),
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.eyebrow}>YOUR APEX OVERVIEW</Text>
      <Text style={styles.heading}>The bigger</Text>
      <Text style={styles.headingGreen}>picture.</Text>

      {/* Main statistics */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>ACTIVE DAYS</Text>
          <Text style={styles.statNumber}>
            {stats.activeDays}
          </Text>
          <Text style={styles.statDescription}>
            Workout days recorded
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>EXERCISES DONE</Text>
          <Text style={styles.statNumber}>
            {stats.totalCompleted}
          </Text>
          <Text style={styles.statDescription}>
            Total completions
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CURRENT STREAK</Text>
          <Text style={styles.statNumber}>
            {stats.streak}
            <Text style={styles.statUnit}> days</Text>
          </Text>
          <Text style={styles.statDescription}>
            Consecutive active days
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>THIS WEEK</Text>
          <Text style={styles.statNumber}>
            {stats.weeklyActiveDays}
            <Text style={styles.statUnit}> / 7</Text>
          </Text>
          <Text style={styles.statDescription}>
            Active workout days
          </Text>
        </View>
      </View>

      {/* Weekly activity */}
      <View style={styles.chartCard}>
        <Text style={styles.cardLabel}>WEEKLY ACTIVITY</Text>
        <Text style={styles.chartTitle}>
          Your last seven days.
        </Text>

        <View style={styles.chart}>
          {stats.week.map((day, index) => {
            const height = day.completedCount > 0
              ? Math.max(
                  12,
                  (day.completedCount / maxWeeklyCount) * 100,
                )
              : 5;

            const isToday =
              day.date === getDateKey(new Date());

            return (
              <View key={day.date} style={styles.chartColumn}>
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${height}%` },
                      day.completedCount > 0
                        ? styles.activeBar
                        : styles.inactiveBar,
                      isToday && styles.todayBar,
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.chartDay,
                    isToday && styles.chartDayToday,
                  ]}
                >
                  {day.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.chartCaption}>
          Bars represent completed exercises each day.
        </Text>
      </View>

      {/* Today's progress */}
      <View style={styles.todayCard}>
        <Text style={styles.cardLabel}>TODAY'S COMPLETION</Text>

        <View style={styles.todayHeader}>
          <Text style={styles.todayNumber}>
            {todayProgress}%
          </Text>

          <Text style={styles.todayCount}>
            {todayCompleted} / {todayExercises.length} completed
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${todayProgress}%` },
            ]}
          />
        </View>

        {todayExercises.length === 0 && (
          <Text style={styles.chartCaption}>
            No exercises planned for today.
          </Text>
        )}
      </View>

      {/* Planned exercises */}
      <View style={styles.plannedCard}>
        <Text style={styles.cardLabel}>
          YOUR TRAINING PLAN
        </Text>
        <Text style={styles.plannedNumber}>
          {totalExercises}
        </Text>
        <Text style={styles.chartCaption}>
          Exercises currently planned across all seven days.
        </Text>
      </View>

      <Text style={styles.footer}>
        CONSISTENCY OVER PERFECTION.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingTop: 16,
    paddingBottom: 35,
  },
  eyebrow: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 13,
  },
  heading: {
    color: COLORS.text,
    fontSize: 35,
    fontWeight: "800",
  },
  headingGreen: {
    color: COLORS.green,
    fontSize: 39,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginTop: 20,
  },
  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    minHeight: 115,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  statNumber: {
    color: COLORS.green,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 12,
  },
  statUnit: {
    fontSize: 13,
  },
  statDescription: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 18,
  },
  cardLabel: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  chartTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 7,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    marginTop: 17,
    gap: 10,
  },
  chartColumn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
  },
  barArea: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "65%",
    borderRadius: 6,
    minHeight: 4,
  },
  activeBar: {
    backgroundColor: "#647D45",
  },
  inactiveBar: {
    backgroundColor: COLORS.border,
  },
  todayBar: {
    backgroundColor: COLORS.green,
  },
  chartDay: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 8,
  },
  chartDayToday: {
    color: COLORS.green,
  },
  chartCaption: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 10,
  },
  todayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 16,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  todayNumber: {
    color: COLORS.green,
    fontSize: 34,
    fontWeight: "900",
  },
  todayCount: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  progressTrack: {
    height: 7,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 13,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 10,
  },
  plannedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 16,
  },
  plannedNumber: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
  },
  footer: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 28,
  },
});
