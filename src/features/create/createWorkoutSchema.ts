import * as Yup from "yup";

import { CreateWorkoutValues } from "./createWorkout";

export const CreateWorkoutSchema = Yup.object<
  Record<keyof CreateWorkoutValues, Yup.AnySchema>
>().shape({
  dates: Yup.array().of(Yup.string()).min(1, "At least one date is required"),
  workout: Yup.object().shape({
    name: Yup.string().required("A workout name is required").notOneOf([""]),
    activities: Yup.array()
      .required("At least one activity is required")
      .min(1, "Atleast one activity is required"),
  }),
});
