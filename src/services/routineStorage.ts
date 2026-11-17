import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoutineData, starterExercises } from "../types/routine";

const STORAGE_KEY = "APEX_ROUTINES_V1";

export async function loadRoutines(): Promise<RoutineData> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        [getCurrentDay()]: starterExercises,
      };
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("Invalid saved routine data");
    }

    return parsed as RoutineData;
  } catch (error) {
    console.error("APEX: Failed to load routines", error);

    return {
      [getCurrentDay()]: starterExercises,
    };
  }
}

export async function saveRoutines(routines: RoutineData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  } catch (error) {
    console.error("APEX: Failed to save routines", error);
    throw error;
  }
}

function getCurrentDay(): string {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return days[(new Date().getDay() + 6) % 7];
}
