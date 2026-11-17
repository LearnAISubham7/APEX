import { useCallback, useEffect, useRef, useState } from "react";

import { Exercise, RoutineData, getTodayName } from "../types/routine";

import { WorkoutDayRecord, WorkoutExerciseRecord } from "../types/history";

import { loadRoutines, saveRoutines } from "../services/routineStorage";
import { restoreBackup, BackupPayload } from "../services/backupService";

import {
  loadWorkoutHistory,
  saveWorkoutHistory,
} from "../services/workoutHistoryStorage";

function getTodayDateKey(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createExerciseRecord(
  exercise: Exercise,
  completed = false,
): WorkoutExerciseRecord {
  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    type: exercise.type,
    target: exercise.target,
    detail: exercise.detail,
    completed,
  };
}

export function useRoutines() {
  const [routines, setRoutines] = useState<RoutineData>({});
  const [history, setHistory] = useState<WorkoutDayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const restoreInProgress = useRef(false);

  const pendingSave = useRef<Promise<void>>(Promise.resolve());

  const enqueueSave = useCallback((task: () => Promise<void>) => {
    const next = pendingSave.current.then(task, task);

    pendingSave.current = next.catch(() => undefined);

    return next;
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setSaveError(null);

    try {
      const [routineData, historyData] = await Promise.all([
        loadRoutines(),
        loadWorkoutHistory(),
      ]);

      setRoutines(routineData);
      setHistory(historyData);
    } catch (error) {
      console.error("APEX: Failed to refresh data", error);
      setSaveError("Could not refresh your workout data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreData = useCallback(async (backup: BackupPayload) => {
    if (restoreInProgress.current) {
      throw new Error("A restore operation is already running.");
    }

    restoreInProgress.current = true;
    setLoading(true);
    setSaveError(null);

    try {
      // Finish any storage save that started before restoration.
      await pendingSave.current;

      // Restore all three datasets with rollback protection.
      await restoreBackup(backup);

      // Reload the restored routines and workout history.
      const [routineData, historyData] = await Promise.all([
        loadRoutines(),
        loadWorkoutHistory(),
      ]);

      setRoutines(routineData);
      setHistory(historyData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not restore your APEX backup.";

      setSaveError(message);
      throw error;
    } finally {
      restoreInProgress.current = false;
      setLoading(false);
    }
  }, []);

  // Load routines and history together.
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const [routineData, historyData] = await Promise.all([
          loadRoutines(),
          loadWorkoutHistory(),
        ]);

        if (active) {
          setRoutines(routineData);
          setHistory(historyData);
        }
      } catch (error) {
        console.error("APEX: Initialization failed", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Persist routine changes.
  useEffect(() => {
    if (loading || restoreInProgress.current) return;

    let active = true;

    async function persist() {
      try {
        await enqueueSave(async () => {
          if (restoreInProgress.current) return;
          await saveRoutines(routines);
        });

        if (active) {
          setSaveError(null);
        }
      } catch {
        if (active) {
          setSaveError("Could not save your workout data.");
        }
      }
    }

    persist();

    return () => {
      active = false;
    };
  }, [routines, loading, enqueueSave]);

  // Persist history separately.
  useEffect(() => {
    if (loading || restoreInProgress.current) return;

    let active = true;

    async function persist() {
      try {
        await enqueueSave(async () => {
          if (restoreInProgress.current) return;
          await saveWorkoutHistory(history);
        });

        if (active) {
          setSaveError(null);
        }
      } catch {
        if (active) {
          setSaveError("Could not save your workout history.");
        }
      }
    }

    persist();

    return () => {
      active = false;
    };
  }, [history, loading, enqueueSave]);

  // Get exercises, using today's history for completion status.
  const getExercises = useCallback(
    (day: string): Exercise[] => {
      const exercises = routines[day] ?? [];

      if (day !== getTodayName()) {
        return exercises;
      }

      const todayRecord = history.find(
        (record) => record.date === getTodayDateKey(),
      );

      if (!todayRecord) {
        return exercises.map((exercise) => ({
          ...exercise,
          completed: false,
        }));
      }

      const completedById = new Map(
        todayRecord.exercises.map((exercise) => [
          exercise.id,
          exercise.completed,
        ]),
      );

      return exercises.map((exercise) => ({
        ...exercise,
        completed: completedById.get(exercise.id) ?? false,
      }));
    },
    [routines, history],
  );

  const addExercise = useCallback((day: string, exercise: Exercise) => {
    setRoutines((previous) => ({
      ...previous,
      [day]: [...(previous[day] ?? []), exercise],
    }));
  }, []);

  const updateExercise = useCallback((day: string, exercise: Exercise) => {
    setRoutines((previous) => ({
      ...previous,
      [day]: (previous[day] ?? []).map((item) =>
        item.id === exercise.id ? exercise : item,
      ),
    }));
  }, []);

  const deleteExercise = useCallback((day: string, id: string) => {
    setRoutines((previous) => ({
      ...previous,
      [day]: (previous[day] ?? []).filter((item) => item.id !== id),
    }));
  }, []);

  // Update the routine and today's date-based history.
  const toggleExercise = useCallback(
    (day: string, id: string) => {
      const currentExercises = routines[day] ?? [];
      const targetExercise = currentExercises.find(
        (exercise) => exercise.id === id,
      );

      if (!targetExercise) return;

      const nextCompleted = !(
        history
          .find((record) => record.date === getTodayDateKey())
          ?.exercises.find((exercise) => exercise.id === id)?.completed ?? false
      );

      setRoutines((previous) => ({
        ...previous,
        [day]: (previous[day] ?? []).map((item) =>
          item.id === id ? { ...item, completed: nextCompleted } : item,
        ),
      }));

      const date = getTodayDateKey();

      setHistory((previous) => {
        const existingRecord = previous.find((record) => record.date === date);

        let exercises: WorkoutExerciseRecord[];

        if (existingRecord) {
          exercises = [...existingRecord.exercises];

          const existingIndex = exercises.findIndex(
            (exercise) => exercise.id === id,
          );

          if (existingIndex >= 0) {
            exercises[existingIndex] = {
              ...exercises[existingIndex],
              completed: nextCompleted,
            };
          } else {
            exercises.push(createExerciseRecord(targetExercise, nextCompleted));
          }
        } else {
          exercises = currentExercises.map((exercise) =>
            createExerciseRecord(
              exercise,
              exercise.id === id ? nextCompleted : false,
            ),
          );
        }

        const newRecord: WorkoutDayRecord = {
          date,
          day,
          exercises,
        };

        if (existingRecord) {
          return previous.map((record) =>
            record.date === date ? newRecord : record,
          );
        }

        return [...previous, newRecord];
      });
    },
    [routines, history],
  );

  const resetDay = useCallback((day: string) => {
    setRoutines((previous) => ({
      ...previous,
      [day]: (previous[day] ?? []).map((item) => ({
        ...item,
        completed: false,
      })),
    }));
  }, []);

  const totalExercises = Object.values(routines).reduce(
    (total, items) => total + items.length,
    0,
  );

  return {
    routines,
    history,
    loading,
    saveError,
    totalExercises,
    getExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    toggleExercise,
    resetDay,
    refreshData,
    restoreData,
  };
}
