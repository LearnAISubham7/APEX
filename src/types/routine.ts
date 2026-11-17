export type ExerciseType = "Reps" | "Time" | "Distance" | "Weight";

export type Exercise = {
  id: string;
  name: string;
  category: string;
  type: ExerciseType;
  target: string;
  detail: string;
  completed: boolean;
};

export type RoutineData = Record<string, Exercise[]>;

export type AppTab = "Today" | "Routines" | "History" | "Stats";

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const getTodayName = (): string => {
  return DAYS[(new Date().getDay() + 6) % 7];
};

export const starterExercises: Exercise[] = [
  {
    id: "starter-1",
    name: "Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 10",
    detail: "30 repetitions",
    completed: false,
  },
  {
    id: "starter-2",
    name: "Running",
    category: "CARDIO",
    type: "Distance",
    target: "2 km",
    detail: "Easy pace",
    completed: false,
  },
  {
    id: "starter-3",
    name: "Pull-ups",
    category: "BACK",
    type: "Reps",
    target: "3 × 5",
    detail: "15 repetitions",
    completed: false,
  },
  {
    id: "starter-4",
    name: "Plank",
    category: "CORE",
    type: "Time",
    target: "3 × 30 sec",
    detail: "90 seconds total",
    completed: false,
  },
];
