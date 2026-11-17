
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

import { WorkoutDayRecord } from "../../../types/history";
import { COLORS } from "../../../theme/colors";

type Props = {
  history: WorkoutDayRecord[];
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getMonthTitle(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function HistoryScreen({ history }: Props) {
  const today = new Date();

  const [visibleMonth, setVisibleMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const todayKey = getDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return todayKey;
  });

  const historyByDate = useMemo(() => {
    return new Map(history.map((record) => [record.date, record]));
  }, [history]);

  const monthDates = useMemo(() => {
    const { year, month } = visibleMonth;

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday-first calendar.
    const startingOffset = (firstDay.getDay() + 6) % 7;

    const cells: (string | null)[] = [];

    for (let i = 0; i < startingOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(getDateKey(year, month, day));
    }

    return cells;
  }, [visibleMonth]);

  const monthRecords = useMemo(() => {
    const prefix = `${visibleMonth.year}-${String(
      visibleMonth.month + 1,
    ).padStart(2, "0")}`;

    return history.filter(
      (record) =>
        record.date.startsWith(prefix) &&
        record.exercises.length > 0 &&
        record.exercises.some((exercise) => exercise.completed),
    );
  }, [history, visibleMonth]);

  const completedExerciseCount = monthRecords.reduce(
    (total, record) =>
      total +
      record.exercises.filter((exercise) => exercise.completed).length,
    0,
  );

  const selectedRecord = historyByDate.get(selectedDate);

  const completedOnSelectedDate =
    selectedRecord?.exercises.filter((exercise) => exercise.completed) ?? [];

  const goToPreviousMonth = () => {
    setVisibleMonth((previous) => {
      const date = new Date(previous.year, previous.month - 1, 1);

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    });
  };

  const goToNextMonth = () => {
    setVisibleMonth((previous) => {
      const date = new Date(previous.year, previous.month + 1, 1);

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    });
  };

  const goToCurrentMonth = () => {
    setVisibleMonth({
      year: today.getFullYear(),
      month: today.getMonth(),
    });

    setSelectedDate(
      getDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ),
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.eyebrow}>YOUR PROGRESS</Text>
      <Text style={styles.heading}>Workout history.</Text>
      <Text style={styles.subtitle}>
        Every session counts. Keep building your consistency.
      </Text>

      {/* Monthly summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {monthRecords.length}
          </Text>
          <Text style={styles.summaryLabel}>ACTIVE DAYS</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {completedExerciseCount}
          </Text>
          <Text style={styles.summaryLabel}>EXERCISES DONE</Text>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <View>
            <Text style={styles.sectionLabel}>ACTIVITY CALENDAR</Text>
            <Text style={styles.monthTitle}>
              {getMonthTitle(
                visibleMonth.year,
                visibleMonth.month,
              )}
            </Text>
          </View>

          <View style={styles.monthActions}>
            <Pressable
              onPress={goToPreviousMonth}
              style={styles.monthButton}
            >
              <Text style={styles.monthArrow}>‹</Text>
            </Pressable>

            <Pressable
              onPress={goToNextMonth}
              style={styles.monthButton}
            >
              <Text style={styles.monthArrow}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAYS.map((day, index) => (
            <Text key={index} style={styles.weekday}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {monthDates.map((dateKey, index) => {
            if (!dateKey) {
              return (
                <View
                  key={`empty-${index}`}
                  style={styles.calendarCell}
                />
              );
            }

            const dayNumber = Number(dateKey.slice(-2));
            const record = historyByDate.get(dateKey);

            const hasActivity = Boolean(
              record &&
                record.exercises.length > 0 &&
                record.exercises.every((exercise) => exercise.completed),
            );

            const isSelected = selectedDate === dateKey;
            const isToday = dateKey === getDateKey(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            return (
              <Pressable
                key={dateKey}
                onPress={() => setSelectedDate(dateKey)}
                style={styles.calendarCell}
              >
                <View
                  style={[
                    styles.dateCircle,
                    isSelected && styles.selectedDateCircle,
                    isToday && !isSelected && styles.todayCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedDateText,
                      isToday && !isSelected && styles.todayText,
                    ]}
                  >
                    {dayNumber}
                  </Text>
                </View>

                {hasActivity && (
                  <View
                    style={[
                      styles.activityDot,
                      isSelected && styles.selectedActivityDot,
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.calendarLegend}>
  <View style={styles.legendInfo}>
    <View style={styles.legendDot} />
    <Text style={styles.legendText}>Workout completed</Text>
  </View>

  <Pressable onPress={goToCurrentMonth} style={styles.todayButton}>
    <Text style={styles.todayLink}>TODAY</Text>
  </Pressable>
</View>
      </View>

      {/* Selected date details */}
      <View style={styles.detailHeader}>
        <View>
          <Text style={styles.sectionLabel}>DAILY DETAILS</Text>
          <Text style={styles.detailDate}>
            {formatDate(selectedDate)}
          </Text>
        </View>
      </View>

      {completedOnSelectedDate.length > 0 ? (
        <View style={styles.exerciseList}>
          <View style={styles.completedHeader}>
            <Text style={styles.completedHeaderText}>
              COMPLETED EXERCISES
            </Text>
            <Text style={styles.completedCount}>
              {completedOnSelectedDate.length} DONE
            </Text>
          </View>

          {completedOnSelectedDate.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>

              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>
                  {exercise.name}
                </Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.category} · {exercise.target}
                </Text>
              </View>

              <View style={styles.doneBadge}>
                <Text style={styles.doneText}>DONE</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>◷</Text>
          <Text style={styles.emptyTitle}>No workout recorded</Text>
          <Text style={styles.emptyDescription}>
            {selectedDate === getDateKey(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            )
              ? "Complete an exercise today and your progress will appear here."
              : "There is no completed workout saved for this date."}
          </Text>
        </View>
      )}

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
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 20,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    color: COLORS.green,
    fontSize: 29,
    fontWeight: "900",
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 5,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 17,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  sectionLabel: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  monthTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 5,
  },
  monthActions: {
    flexDirection: "row",
    gap: 8,
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  monthArrow: {
    color: COLORS.text,
    fontSize: 25,
    lineHeight: 29,
  },
  weekdays: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: "14.2857%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDateCircle: {
    backgroundColor: COLORS.green,
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  selectedDateText: {
    color: COLORS.background,
    fontWeight: "900",
  },
  todayText: {
    color: COLORS.green,
  },
  activityDot: {
    position: "absolute",
    bottom: 1,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  selectedActivityDot: {
    backgroundColor: COLORS.text,
  },
  calendarLegend: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 14,
},
  legendInfo: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

todayButton: {
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 20,
  backgroundColor: COLORS.surface,
},
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
    marginRight: 7,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    flex: 1,
  },
  todayLink: {
  color: COLORS.green,
  fontSize: 11,
  fontWeight: "800",
  letterSpacing: 1,
},
  detailHeader: {
    marginTop: 27,
    marginBottom: 13,
  },
  detailDate: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  exerciseList: {
    gap: 9,
  },
  completedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  completedHeaderText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  completedCount: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 13,
  },
  exerciseIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  checkmark: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "900",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },
  exerciseDetail: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  doneBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  doneText: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyIcon: {
    color: COLORS.green,
    fontSize: 30,
    marginBottom: 10,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
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
