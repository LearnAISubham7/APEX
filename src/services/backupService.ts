import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

import { Exercise, ExerciseType, RoutineData } from "../types/routine";
import { WorkoutDayRecord } from "../types/history";
import { ExerciseTemplate } from "../features/routines/data/exerciseLibrary";

// Keep these keys identical to the existing storage services.
const STORAGE_KEYS = {
  routines: "APEX_ROUTINES_V1",
  history: "APEX_WORKOUT_HISTORY_V1",
  customExercises: "APEX_CUSTOM_EXERCISES_V1",
} as const;

const BACKUP_VERSION = 1;
const BACKUP_APP = "APEX";

export type BackupPayload = {
  app: typeof BACKUP_APP;
  version: number;
  createdAt: string;
  data: {
    routines: RoutineData;
    history: WorkoutDayRecord[];
    customExercises: ExerciseTemplate[];
  };
};

type StorageSnapshot = {
  routines: string | null;
  history: string | null;
  customExercises: string | null;
};

const VALID_EXERCISE_TYPES: ExerciseType[] = [
  "Reps",
  "Time",
  "Distance",
  "Weight",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isExercise(value: unknown): value is Exercise {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    VALID_EXERCISE_TYPES.includes(value.type as ExerciseType) &&
    typeof value.target === "string" &&
    typeof value.detail === "string" &&
    typeof value.completed === "boolean"
  );
}

function isExerciseTemplate(value: unknown): value is ExerciseTemplate {
  if (!isObject(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    VALID_EXERCISE_TYPES.includes(value.type as ExerciseType) &&
    typeof value.target === "string" &&
    typeof value.detail === "string"
  );
}

function isRoutineData(value: unknown): value is RoutineData {
  if (!isObject(value)) return false;

  return Object.values(value).every(
    (exercises) => Array.isArray(exercises) && exercises.every(isExercise),
  );
}

function isWorkoutHistory(value: unknown): value is WorkoutDayRecord[] {
  if (!Array.isArray(value)) return false;

  return value.every((record) => {
    if (!isObject(record)) return false;

    return (
      typeof record.date === "string" &&
      typeof record.day === "string" &&
      Array.isArray(record.exercises) &&
      record.exercises.every(isExercise)
    );
  });
}

function isCustomExerciseLibrary(value: unknown): value is ExerciseTemplate[] {
  return Array.isArray(value) && value.every(isExerciseTemplate);
}

function validateBackup(value: unknown): BackupPayload {
  if (!isObject(value)) {
    throw new Error("This file is not a valid APEX backup.");
  }

  if (value.app !== BACKUP_APP) {
    throw new Error("This backup does not belong to APEX.");
  }

  if (value.version !== BACKUP_VERSION) {
    throw new Error(
      "This backup version is not supported by this version of APEX.",
    );
  }

  if (
    typeof value.createdAt !== "string" ||
    Number.isNaN(Date.parse(value.createdAt))
  ) {
    throw new Error("The backup date is invalid.");
  }

  if (!isObject(value.data)) {
    throw new Error("Backup data is missing.");
  }

  const { routines, history, customExercises } = value.data;

  if (!isRoutineData(routines)) {
    throw new Error("The routines data is invalid.");
  }

  if (!isWorkoutHistory(history)) {
    throw new Error("The workout history data is invalid.");
  }

  if (!isCustomExerciseLibrary(customExercises)) {
    throw new Error("The custom exercise data is invalid.");
  }

  return value as unknown as BackupPayload;
}

async function readCurrentStorage(): Promise<BackupPayload["data"]> {
  const entries = await AsyncStorage.multiGet([
    STORAGE_KEYS.routines,
    STORAGE_KEYS.history,
    STORAGE_KEYS.customExercises,
  ]);

  const stored = {
    routines: entries[0][1],
    history: entries[1][1],
    customExercises: entries[2][1],
  };

  let routines: unknown = {};
  let history: unknown = [];
  let customExercises: unknown = [];

  try {
    if (stored.routines !== null) {
      routines = JSON.parse(stored.routines);
    }

    if (stored.history !== null) {
      history = JSON.parse(stored.history);
    }

    if (stored.customExercises !== null) {
      customExercises = JSON.parse(stored.customExercises);
    }
  } catch {
    throw new Error(
      "Existing APEX data could not be read. No backup was created.",
    );
  }

  if (
    !isRoutineData(routines) ||
    !isWorkoutHistory(history) ||
    !isCustomExerciseLibrary(customExercises)
  ) {
    throw new Error(
      "Existing APEX data is invalid. Please do not overwrite it.",
    );
  }

  return {
    routines,
    history,
    customExercises,
  };
}

export async function createBackupFile(): Promise<string> {
  const data = await readCurrentStorage();

  const backup: BackupPayload = {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    data,
  };

  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `APEX-Backup-${date}.json`;

  const file = new File(Paths.cache, filename);

  file.create();
  await file.write(JSON.stringify(backup, null, 2));

  return file.uri;
}

export async function shareBackupFile(): Promise<void> {
  const uri = await createBackupFile();

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error("File sharing is not available on this device.");
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/json",
    dialogTitle: "Save your APEX backup",
    UTI: "public.json",
  });
}

export async function pickBackupFile(): Promise<BackupPayload | null> {
  const result = await File.pickFileAsync({
    mimeTypes: ["application/json"],
  });

  if (result.canceled) {
    return null;
  }

  const content = result.result.textSync();

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  return validateBackup(parsed);
}

export async function restoreBackup(backup: BackupPayload): Promise<void> {
  // Validate again before touching existing data.
  const validated = validateBackup(backup);

  const previous: StorageSnapshot = {
    routines: await AsyncStorage.getItem(STORAGE_KEYS.routines),
    history: await AsyncStorage.getItem(STORAGE_KEYS.history),
    customExercises: await AsyncStorage.getItem(STORAGE_KEYS.customExercises),
  };

  const newEntries: [string, string][] = [
    [STORAGE_KEYS.routines, JSON.stringify(validated.data.routines)],
    [STORAGE_KEYS.history, JSON.stringify(validated.data.history)],
    [
      STORAGE_KEYS.customExercises,
      JSON.stringify(validated.data.customExercises),
    ],
  ];

  try {
    await AsyncStorage.multiSet(newEntries);
  } catch {
    try {
      const rollbackEntries: [string, string][] = [];
      const missingKeys: string[] = [];

      for (const [name, key] of Object.entries(STORAGE_KEYS)) {
        const oldValue = previous[name as keyof StorageSnapshot];

        if (oldValue === null) {
          missingKeys.push(key);
        } else {
          rollbackEntries.push([key, oldValue]);
        }
      }

      if (rollbackEntries.length > 0) {
        await AsyncStorage.multiSet(rollbackEntries);
      }

      if (missingKeys.length > 0) {
        await AsyncStorage.multiRemove(missingKeys);
      }
    } catch {
      throw new Error(
        "Restore failed and automatic rollback also failed. Do not close APEX. Your data needs attention.",
      );
    }

    throw new Error(
      "Restore failed. Your previous APEX data has been restored.",
    );
  }
}
