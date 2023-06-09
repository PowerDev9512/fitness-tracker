import { CompletedWorkout, ScheduledWorkout, User } from "types";

import {
  createDistanceFormatter,
  createMeasurementFormatter,
  createWeightFormatter,
} from "./formatting";
import { ViewedScreens } from "store";

export type LogScope = "info" | "error" | "debug";

export const log = (message: any, scope: LogScope = "debug") => {
  if (process.env.NODE_ENV !== "production") {
    const messageAsJson = JSON.stringify(message);
    switch (scope) {
      case "info":
        console.info(messageAsJson);
        break;
      case "error":
        console.error(messageAsJson);
        break;
      case "debug":
        console.debug(messageAsJson);
        break;
      default:
        console.log(messageAsJson);
    }
  }
};

export const getWeightFormatter = (user: User | undefined | null) =>
  createWeightFormatter(user?.userSettings?.weightUnit ?? "kilograms");

export const getDistanceFormatter = (user: User | undefined | null) =>
  createDistanceFormatter(user?.userSettings?.measurementUnit ?? "metric");

export const getWeasurementFormatter = (user: User | undefined | null) =>
  createMeasurementFormatter(user?.userSettings?.measurementUnit ?? "metric");

export const getScheduledWorkouts = (user: User | undefined | null) =>
  (user
    ? user.workouts.filter((workout) => !workout.past && !workout.completed)
    : []) as ScheduledWorkout[];

export const getPastWorkouts = (user: User | undefined | null) =>
  (user
    ? user.workouts
        .filter((workout) => workout.past || workout.completed)
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    : []) as CompletedWorkout[];

export const getUnreadMessages = (viewedScreens: ViewedScreens) => {
  return Object.entries(viewedScreens).filter(([key, value]) => {
    return key.toLowerCase().startsWith("message") && value === false;
  }).length;
};
