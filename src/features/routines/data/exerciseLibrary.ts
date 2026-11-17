import { ExerciseType } from "../../../types/routine";

export type ExerciseTemplate = {
  name: string;
  category: string;
  type: ExerciseType;
  target: string;
  detail: string;
};

export const exerciseLibrary: ExerciseTemplate[] = [
  // CHEST
  {
    name: "Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 10",
    detail: "Standard push-ups",
  },
  {
    name: "Incline Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 12",
    detail: "Hands elevated",
  },
  {
    name: "Decline Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 8",
    detail: "Feet elevated",
  },
  {
    name: "Wide Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 10",
    detail: "Wide hand placement",
  },
  {
    name: "Diamond Push-ups",
    category: "CHEST",
    type: "Reps",
    target: "3 × 6",
    detail: "Close hand placement",
  },

  // BACK
  {
    name: "Pull-ups",
    category: "BACK",
    type: "Reps",
    target: "3 × 5",
    detail: "Overhand grip",
  },
  {
    name: "Chin-ups",
    category: "BACK",
    type: "Reps",
    target: "3 × 5",
    detail: "Underhand grip",
  },
  {
    name: "Inverted Rows",
    category: "BACK",
    type: "Reps",
    target: "3 × 10",
    detail: "Bodyweight rows",
  },
  {
    name: "Superman Hold",
    category: "BACK",
    type: "Time",
    target: "3 × 20 sec",
    detail: "Controlled hold",
  },
  {
    name: "Bird Dog",
    category: "BACK",
    type: "Reps",
    target: "3 × 10",
    detail: "Each side",
  },

  // SHOULDERS
  {
    name: "Pike Push-ups",
    category: "SHOULDERS",
    type: "Reps",
    target: "3 × 8",
    detail: "Controlled movement",
  },
  {
    name: "Shoulder Press",
    category: "SHOULDERS",
    type: "Reps",
    target: "3 × 10",
    detail: "Use suitable resistance",
  },
  {
    name: "Lateral Raises",
    category: "SHOULDERS",
    type: "Reps",
    target: "3 × 12",
    detail: "Light resistance",
  },
  {
    name: "Arm Circles",
    category: "SHOULDERS",
    type: "Time",
    target: "2 × 30 sec",
    detail: "Forward and backward",
  },

  // ARMS
  {
    name: "Bicep Curls",
    category: "ARMS",
    type: "Reps",
    target: "3 × 12",
    detail: "Controlled curls",
  },
  {
    name: "Hammer Curls",
    category: "ARMS",
    type: "Reps",
    target: "3 × 10",
    detail: "Neutral grip",
  },
  {
    name: "Tricep Dips",
    category: "ARMS",
    type: "Reps",
    target: "3 × 8",
    detail: "Use a stable support",
  },
  {
    name: "Tricep Extensions",
    category: "ARMS",
    type: "Reps",
    target: "3 × 12",
    detail: "Controlled movement",
  },

  // LEGS
  {
    name: "Squats",
    category: "LEGS",
    type: "Reps",
    target: "3 × 15",
    detail: "Bodyweight squats",
  },
  {
    name: "Jump Squats",
    category: "LEGS",
    type: "Reps",
    target: "3 × 10",
    detail: "Land softly",
  },
  {
    name: "Lunges",
    category: "LEGS",
    type: "Reps",
    target: "3 × 10",
    detail: "Each leg",
  },
  {
    name: "Reverse Lunges",
    category: "LEGS",
    type: "Reps",
    target: "3 × 10",
    detail: "Each leg",
  },
  {
    name: "Calf Raises",
    category: "LEGS",
    type: "Reps",
    target: "3 × 15",
    detail: "Full range of motion",
  },
  {
    name: "Glute Bridges",
    category: "LEGS",
    type: "Reps",
    target: "3 × 12",
    detail: "Squeeze at the top",
  },
  {
    name: "Wall Sit",
    category: "LEGS",
    type: "Time",
    target: "3 × 30 sec",
    detail: "Hold against a wall",
  },

  // CORE
  {
    name: "Plank",
    category: "CORE",
    type: "Time",
    target: "3 × 30 sec",
    detail: "Maintain a straight body line",
  },
  {
    name: "Side Plank",
    category: "CORE",
    type: "Time",
    target: "2 × 20 sec",
    detail: "Each side",
  },
  {
    name: "Crunches",
    category: "CORE",
    type: "Reps",
    target: "3 × 15",
    detail: "Controlled repetitions",
  },
  {
    name: "Leg Raises",
    category: "CORE",
    type: "Reps",
    target: "3 × 10",
    detail: "Keep movement controlled",
  },
  {
    name: "Mountain Climbers",
    category: "CORE",
    type: "Time",
    target: "3 × 30 sec",
    detail: "Controlled pace",
  },
  {
    name: "Bicycle Crunches",
    category: "CORE",
    type: "Reps",
    target: "3 × 15",
    detail: "Each side",
  },
  {
    name: "Dead Bug",
    category: "CORE",
    type: "Reps",
    target: "3 × 10",
    detail: "Each side",
  },

  // CARDIO
  {
    name: "Running",
    category: "CARDIO",
    type: "Distance",
    target: "2 km",
    detail: "Easy pace",
  },
  {
    name: "Walking",
    category: "CARDIO",
    type: "Distance",
    target: "2 km",
    detail: "Comfortable pace",
  },
  {
    name: "Jogging",
    category: "CARDIO",
    type: "Time",
    target: "20 min",
    detail: "Easy pace",
  },
  {
    name: "Cycling",
    category: "CARDIO",
    type: "Time",
    target: "20 min",
    detail: "Steady pace",
  },
  {
    name: "Jumping Jacks",
    category: "CARDIO",
    type: "Reps",
    target: "3 × 30",
    detail: "Controlled repetitions",
  },
  {
    name: "High Knees",
    category: "CARDIO",
    type: "Time",
    target: "3 × 30 sec",
    detail: "Moderate pace",
  },
  {
    name: "Burpees",
    category: "CARDIO",
    type: "Reps",
    target: "3 × 8",
    detail: "Controlled repetitions",
  },
  {
    name: "Skipping",
    category: "CARDIO",
    type: "Time",
    target: "5 min",
    detail: "Steady pace",
  },

  // MOBILITY & FLEXIBILITY
  {
    name: "Cat-Cow Stretch",
    category: "MOBILITY",
    type: "Reps",
    target: "2 × 10",
    detail: "Move slowly with breathing",
  },
  {
    name: "Hip Circles",
    category: "MOBILITY",
    type: "Reps",
    target: "2 × 10",
    detail: "Each direction",
  },
  {
    name: "Shoulder Stretch",
    category: "FLEXIBILITY",
    type: "Time",
    target: "2 × 20 sec",
    detail: "Each side",
  },
  {
    name: "Hamstring Stretch",
    category: "FLEXIBILITY",
    type: "Time",
    target: "2 × 30 sec",
    detail: "Each leg",
  },
  {
    name: "Quad Stretch",
    category: "FLEXIBILITY",
    type: "Time",
    target: "2 × 20 sec",
    detail: "Each leg",
  },

  // WEIGHT TRAINING
  {
    name: "Dumbbell Bench Press",
    category: "CHEST",
    type: "Weight",
    target: "3 × 10 at 5 kg",
    detail: "Per dumbbell",
  },
  {
    name: "Deadlift",
    category: "BACK",
    type: "Weight",
    target: "3 × 8 at 20 kg",
    detail: "Use suitable resistance and form",
  },
  {
    name: "Goblet Squat",
    category: "LEGS",
    type: "Weight",
    target: "3 × 10 at 5 kg",
    detail: "Hold weight close to chest",
  },
  {
    name: "Dumbbell Row",
    category: "BACK",
    type: "Weight",
    target: "3 × 10 at 5 kg",
    detail: "Each arm",
  },
];
