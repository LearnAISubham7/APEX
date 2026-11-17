import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseType } from "../types/routine";
import { ExerciseTemplate } from "../features/routines/data/exerciseLibrary";

const STORAGE_KEY = "APEX_CUSTOM_EXERCISES_V1";

export async function loadCustomExercises(): Promise<ExerciseTemplate[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is ExerciseTemplate => {
      return (
        item !== null &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        typeof item.category === "string" &&
        ["Reps", "Time", "Distance", "Weight"].includes(
          item.type as ExerciseType,
        ) &&
        typeof item.target === "string" &&
        typeof item.detail === "string"
      );
    });
  } catch (error) {
    console.error("Failed to load custom exercises:", error);
    return [];
  }
}

export async function saveCustomExercise(
  exercise: ExerciseTemplate,
): Promise<void> {
  try {
    const existing = await loadCustomExercises();

    const normalizedName = exercise.name.trim().toLowerCase();

    const updated = existing.filter(
      (item) => item.name.trim().toLowerCase() !== normalizedName,
    );

    updated.push(exercise);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save custom exercise:", error);
    throw error;
  }
}
