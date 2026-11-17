import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutDayRecord } from "../types/history";

const HISTORY_STORAGE_KEY = "APEX_WORKOUT_HISTORY_V1";

export async function loadWorkoutHistory(): Promise<WorkoutDayRecord[]> {
  try {
    const saved = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid workout history data");
    }

    return parsed as WorkoutDayRecord[];
  } catch (error) {
    console.error("APEX: Failed to load workout history", error);
    return [];
  }
}

export async function saveWorkoutHistory(
  history: WorkoutDayRecord[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("APEX: Failed to save workout history", error);
    throw error;
  }
}
