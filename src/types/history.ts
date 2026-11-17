import { ExerciseType } from "./routine";

export type WorkoutExerciseRecord = {
  id: string;
  name: string;
  category: string;
  type: ExerciseType;
  target: string;
  detail: string;
  completed: boolean;
};

export type WorkoutDayRecord = {
  date: string;
  day: string;
  exercises: WorkoutExerciseRecord[];
};
