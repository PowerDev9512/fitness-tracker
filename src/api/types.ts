import {
  Badge,
  Buddy,
  Equipment,
  Exercise,
  Image,
  Max,
  Mechanics,
  MuscleGroup,
  Reward,
  Title,
  User,
  UserSettings,
  Workout,
} from "types";

export type ApiData = {
  id: number;
  type: "strength" | "cardio";
  duration: number | null;
  distance: number | null;
  reps: number | null;
  sets: number | null;
  weight: number | null;
  targetDuration: number;
  targetDistance: number;
  targetReps: number;
  targetSets: number;
  targetWeight: number;
  notes: string | null;
  image: Image | null;
};

export interface ApiExercise {
  id: number;
  name: string;
  type: "strength" | "cardio";
  mainMuscleGroup: string;
  muscleGroupImage: Image;
  muscleGroupImageId: number;
  detailedMuscleGroup: string | null;
  otherMuscleGroups: string[];
  mechanics: Mechanics;
  equipment: Equipment;
  muscleGroupStats: Record<MuscleGroup, number>;
}

export interface ApiActivity {
  id: number;
  exercise: ApiExercise;
  data: ApiData;
}

export interface ApiWorkout {
  id: number;
  time: string;
  completed: boolean;
  past: boolean;
  name: string;
  activities: ApiActivity[];
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  height: number;
  weight: number;
  age: number;
  weeklyWorkoutAmountGoal: number;
  workouts: ApiWorkout[];
  workoutBuddy: Buddy;
  userSettings: UserSettings;
  avatar: Image | null;
  inventory: Reward[];
  claimedAchievements: number[];
  title: Title | null;
  badge: Badge | null;
  maxes: Max[];
  friendRequests: number[];
  friends: number[];
}

export function ApiExerciseToExercise(
  exercise: ApiExercise,
  maxes: Max[]
): Exercise {
  return {
    ...exercise,
    exerciseId: exercise.id,
    userHasMax: maxes.some((max) => max.exercise === exercise.name),
  };
}

export function ApiWorkoutToWorkout(
  workout: ApiWorkout,
  maxes: Max[]
): Workout {
  const time = new Date();
  time.setHours(0, 0, 0, 0);

  return {
    id: workout.id,
    time: workout.time,
    completed: workout.completed,
    past: new Date(workout.time) < time,
    name: workout.name,
    activities: workout.activities.map((activity) => ({
      ...activity.exercise,
      ...activity.data,
      id: activity.id,
      exerciseId: activity.exercise.id,
      dataId: activity.data.id,
      userHasMax: maxes.some((max) => max.exercise === activity.exercise.name),
    })),
  };
}

export function ApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email,
    password: apiUser.password,
    workouts: apiUser.workouts.map((workout) =>
      ApiWorkoutToWorkout(workout, apiUser.maxes)
    ),
    workoutBuddy: apiUser.workoutBuddy,
    userSettings: apiUser.userSettings,
    height: apiUser.height,
    weight: apiUser.weight,
    age: apiUser.age,
    weeklyWorkoutAmountGoal: apiUser.weeklyWorkoutAmountGoal,
    avatar: apiUser.avatar,
    inventory: apiUser.inventory,
    claimedAchievements: apiUser.claimedAchievements,
    title: apiUser.title,
    badge: apiUser.badge,
    maxes: apiUser.maxes,
    friendRequests: apiUser.friendRequests,
    friends: apiUser.friends,
  };
}

export function WorkoutToApiWorkout(
  workout: Workout,
  maintainIds: boolean = false
): ApiWorkout {
  return {
    id: workout.id,
    time: workout.time,
    completed: workout.completed,
    past: workout.past,
    name: workout.name,
    activities: workout.activities.map((activity) => {
      const exercise: ApiExercise = {
        id: maintainIds ? activity.exerciseId : 0,
        name: activity.name,
        type: activity.type,
        muscleGroupImage: activity.muscleGroupImage,
        mainMuscleGroup: activity.mainMuscleGroup,
        muscleGroupImageId: activity.muscleGroupImageId,
        detailedMuscleGroup: activity.detailedMuscleGroup,
        otherMuscleGroups: activity.otherMuscleGroups,
        mechanics: activity.mechanics,
        equipment: activity.equipment,
        muscleGroupStats: activity.muscleGroupStats,
      };

      const data: ApiData =
        activity.type === "strength"
          ? {
              id: maintainIds ? activity.dataId : 0,
              reps: activity.reps,
              sets: activity.sets,
              weight: activity.weight,
              targetReps: activity.targetReps,
              targetSets: activity.targetSets,
              targetWeight: activity.targetWeight,
              targetDistance: 0,
              targetDuration: 0,
              distance: 0,
              duration: 0,
              notes: activity.notes,
              image: activity.image,
              type: activity.type,
            }
          : {
              id: maintainIds ? activity.dataId : 0,
              distance: activity.distance,
              duration: activity.duration,
              targetDistance: activity.targetDistance,
              targetDuration: activity.targetDuration,
              targetReps: 0,
              targetSets: 0,
              targetWeight: 0,
              reps: 0,
              sets: 0,
              weight: 0,
              notes: activity.notes,
              image: activity.image,
              type: activity.type,
            };

      return {
        id: maintainIds ? activity.id : 0,
        exercise,
        data,
      };
    }),
  };
}

export function UserToApiUser(user: User): ApiUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    workouts: user.workouts.map((workout) => WorkoutToApiWorkout(workout)),
    workoutBuddy: user.workoutBuddy,
    userSettings: user.userSettings,
    height: user.height,
    weight: user.weight,
    age: user.age,
    weeklyWorkoutAmountGoal: user.weeklyWorkoutAmountGoal,
    avatar: user.avatar,
    inventory: user.inventory,
    claimedAchievements: user.claimedAchievements,
    title: user.title,
    badge: user.badge,
    maxes: user.maxes,
    friendRequests: user.friendRequests,
    friends: user.friends,
  };
}

export const ErrorCodes: {
  [key: number]: { title: string; description?: string };
} = {
  1: {
    title: "The email address you have entered is not registered",
    description: "Please check your email address and try again",
  },
  2: {
    title: "The requested activity does not exist",
  },
  3: {
    title: "We've failed to load your exercises",
    description: "Please try again later",
  },
  4: {
    title: "An unknown error has occurred",
    description: "Please try again later",
  },
  5: {
    title: "The achievement you are trying to claim has already been claimed",
    description: "Please refresh the page",
  },
  6: {
    title: "The achievement you are trying to claim does not exist",
  },
  7: {
    title: "The achievement you are trying to claim is not available to you",
  },
  8: {
    title: "We've failed to claim the rewards for this achievement",
    description: "Please try again later",
  },
  9: {
    title: "The password you have entered is incorrect",
  },
  10: {
    title: "The username or email you have entered is already in use",
  },
  11: {
    title: "The username or email you have entered is already in use",
  },
  12: {
    title: "The username or email you have entered is already in use",
  },
  13: {
    title: "The friend you are interacting with does not exist",
  },
  14: {
    title: "The friend you are adding is already your friend",
  },
  15: {
    title: "The friend you are adding already has a pending request from you",
  },
  16: {
    title: "The friend you are deleting is not your friend",
  },
  17: {
    title: "The friend request you are interacting with does not exist",
  },
  18: {
    title: "An unknown error has occurred",
    description: "Please try again later",
  },
  19: {
    title: "The requested exercise does not exist",
  },
  20: {
    title: "The requested workout does not exist",
  },
};

export type ApiError = {
  errors: {
    message: string;
    code: keyof typeof ErrorCodes;
  }[];
};

export function isApiError(response: any): response is ApiError {
  return response.errors !== undefined;
}
