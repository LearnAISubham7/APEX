
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  DAYS,
  Exercise,
} from "../../../types/routine";

import { COLORS } from "../../../theme/colors";
import ExerciseForm from "../components/ExerciseForm";

type Props = {
  selectedDay: string;
  onDayChange: (day: string) => void;
  getExercises: (day: string) => Exercise[];
  onAdd: (day: string, exercise: Exercise) => void;
  onUpdate: (day: string, exercise: Exercise) => void;
  onDelete: (day: string, id: string) => void;
};

export default function RoutinesScreen({
  selectedDay,
  onDayChange,
  getExercises,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);

  const exercises = getExercises(selectedDay);

  const totalWeeklyExercises = DAYS.reduce(
    (total, day) => total + getExercises(day).length,
    0
  );

  const activeDays = DAYS.filter(
    (day) => getExercises(day).length > 0
  ).length;

  const openAdd = () => {
    setEditing(null);
    setFormVisible(true);
  };

  const openEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setFormVisible(true);
  };

  const handleSave = (exercise: Exercise) => {
    if (editing) {
      onUpdate(selectedDay, exercise);
    } else {
      onAdd(selectedDay, exercise);
    }

    setFormVisible(false);
    setEditing(null);
  };

  const handleClose = () => {
    setFormVisible(false);
    setEditing(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            YOUR TRAINING BLUEPRINT
          </Text>

          <Text style={styles.heading}>
            Build your
          </Text>

          <Text style={styles.headingGreen}>
            routine.
          </Text>

          <Text style={styles.subtitle}>
            Plan with purpose. Train with discipline.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>▤</Text>
        </View>
      </View>

      {/* WEEKLY OVERVIEW */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewTop}>
          <Text style={styles.overviewLabel}>
            WEEKLY OVERVIEW
          </Text>

          <Text style={styles.overviewBadge}>
            7 DAYS
          </Text>
        </View>

        <View style={styles.overviewNumbers}>
          <View>
            <Text style={styles.overviewNumber}>
              {totalWeeklyExercises}
            </Text>
            <Text style={styles.overviewCaption}>
              TOTAL EXERCISES
            </Text>
          </View>

          <View style={styles.overviewDivider} />

          <View>
            <Text style={styles.overviewNumber}>
              {activeDays}/7
            </Text>
            <Text style={styles.overviewCaption}>
              ACTIVE DAYS
            </Text>
          </View>
        </View>

        <View style={styles.weekTrack}>
          {DAYS.map((day) => {
            const hasExercises =
              getExercises(day).length > 0;

            return (
              <View
                key={day}
                style={[
                  styles.weekSegment,
                  hasExercises && styles.weekSegmentActive,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.overviewFooter}>
          {activeDays === 0
            ? "YOUR TRAINING WEEK STARTS HERE."
            : `${activeDays} DAYS PLANNED. KEEP BUILDING.`}
        </Text>
      </View>

      {/* DAY SELECTOR */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Your training week
          </Text>

          <Text style={styles.sectionSubtitle}>
            Select a day to manage your exercises.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayList}
      >
        {DAYS.map((day) => {
          const active = selectedDay === day;
          const count = getExercises(day).length;

          return (
            <Pressable
              key={day}
              onPress={() => onDayChange(day)}
              style={({ pressed }) => [
                styles.dayCard,
                active && styles.dayActive,
                pressed && styles.dayPressed,
              ]}
            >
              <Text
                style={[
                  styles.dayLetter,
                  active && styles.dayTextActive,
                ]}
              >
                {day.slice(0, 3).toUpperCase()}
              </Text>

              <Text
                style={[
                  styles.dayCount,
                  active && styles.dayTextActive,
                ]}
              >
                {count}
              </Text>

              <View
                style={[
                  styles.dayIndicator,
                  count > 0 && styles.dayIndicatorActive,
                  active && styles.dayIndicatorSelected,
                ]}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {/* SELECTED DAY */}
      <View style={styles.routineHeader}>
        <View style={styles.selectedDayInfo}>
          <Text style={styles.selectedDayLabel}>
            YOUR PLAN FOR
          </Text>

          <Text style={styles.selectedDay}>
            {selectedDay}
          </Text>

          <Text style={styles.sectionSubtitle}>
            {exercises.length}{" "}
            {exercises.length === 1
              ? "exercise"
              : "exercises"}{" "}
            scheduled
          </Text>
        </View>

        <Pressable
          onPress={openAdd}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.addText}>
            ＋ ADD
          </Text>
        </Pressable>
      </View>

      {/* EXERCISE LIST */}
      {exercises.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>＋</Text>
          </View>

          <Text style={styles.emptyTitle}>
            Rest day or empty routine
          </Text>

          <Text style={styles.emptyDescription}>
            No exercises planned for this day.
            Take a rest or build your next workout.
          </Text>

          <Pressable
            onPress={openAdd}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.primaryText}>
              ADD FIRST EXERCISE
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <View
              key={exercise.id}
              style={styles.exerciseCard}
            >
              <View style={styles.number}>
                <Text style={styles.numberText}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>

              <View style={styles.exerciseInfo}>
                <Text style={styles.category}>
                  {exercise.category.toUpperCase()}
                  {"  ·  "}
                  {exercise.type.toUpperCase()}
                </Text>

                <Text
                  style={styles.exerciseName}
                  numberOfLines={1}
                >
                  {exercise.name}
                </Text>

                <Text style={styles.exerciseTarget}>
                  {exercise.target}
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => openEdit(exercise)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text style={styles.editText}>✎</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    onDelete(selectedDay, exercise.id)
                  }
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressedButton,
                  ]}
                >
                  <Text style={styles.deleteText}>×</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TRAINING TIP */}
      <View style={styles.tip}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipIcon}>✦</Text>

          <Text style={styles.category}>
            APEX TRAINING NOTE
          </Text>
        </View>

        <Text style={styles.tipText}>
          Recovery is part of progress. A well-planned
          rest day is just as important as a training day.
        </Text>
      </View>

      {/* ADD / EDIT FORM */}
      <ExerciseForm
        visible={formVisible}
        day={selectedDay}
        exercise={editing}
        onClose={handleClose}
        onSave={handleSave}
      />

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  eyebrow: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 13,
  },

  heading: {
    color: COLORS.text,
    fontSize: 37,
    fontWeight: "900",
    lineHeight: 42,
    letterSpacing: -1.5,
  },

  headingGreen: {
    color: COLORS.green,
    fontSize: 41,
    fontWeight: "900",
    lineHeight: 46,
    letterSpacing: -1.5,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#20271A",
    borderWidth: 1,
    borderColor: "#465A2C",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconText: {
    color: COLORS.green,
    fontSize: 25,
    fontWeight: "800",
  },

  overviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 19,
    marginBottom: 29,
  },

  overviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overviewLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  overviewBadge: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    backgroundColor: "#26331C",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  overviewNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 27,
    marginVertical: 20,
  },

  overviewNumber: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: "900",
  },

  overviewCaption: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 4,
  },

  overviewDivider: {
    height: 43,
    width: 1,
    backgroundColor: COLORS.border,
  },

  weekTrack: {
    flexDirection: "row",
    gap: 5,
  },

  weekSegment: {
    flex: 1,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#30352D",
  },

  weekSegmentActive: {
    backgroundColor: COLORS.green,
  },

  overviewFooter: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 13,
  },

  sectionHeader: {
    marginBottom: 2,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },

  dayList: {
    gap: 9,
    paddingVertical: 17,
    paddingRight: 10,
  },

  dayCard: {
    width: 57,
    height: 75,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  dayActive: {
    backgroundColor: "#26331C",
    borderColor: COLORS.green,
  },

  dayPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },

  dayLetter: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "900",
  },

  dayCount: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
  },

  dayTextActive: {
    color: COLORS.green,
  },

  dayIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "transparent",
  },

  dayIndicatorActive: {
    backgroundColor: "#64734E",
  },

  dayIndicatorSelected: {
    backgroundColor: COLORS.green,
  },

  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 17,
  },

  selectedDayInfo: {
    flex: 1,
  },

  selectedDayLabel: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  selectedDay: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "900",
  },

  addButton: {
    backgroundColor: COLORS.green,
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  addText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: "900",
  },

  pressedButton: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  exerciseList: {
    gap: 10,
  },

  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 13,
    minHeight: 80,
  },

  number: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#23291F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  numberText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "900",
  },

  exerciseInfo: {
    flex: 1,
    minWidth: 0,
  },

  category: {
    color: COLORS.green,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 5,
  },

  exerciseName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "900",
  },

  exerciseTarget: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 7,
    marginLeft: 7,
  },

  actionButton: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: "#242920",
    alignItems: "center",
    justifyContent: "center",
  },

  editText: {
    color: COLORS.green,
    fontSize: 18,
  },

  deleteText: {
    color: COLORS.danger,
    fontSize: 21,
  },

  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 3,
  },

  emptyIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#20271A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyIcon: {
    color: COLORS.green,
    fontSize: 34,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },

  primaryButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 18,
    width: "100%",
  },

  primaryText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: "900",
  },

  tip: {
    backgroundColor: "#182016",
    borderRadius: 17,
    padding: 17,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#303F25",
  },

  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },

  tipIcon: {
    color: COLORS.green,
    fontSize: 15,
  },

  tipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 20,
  },

  bottomSpace: {
    height: 15,
  },
});
