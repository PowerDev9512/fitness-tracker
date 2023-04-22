import { useExercises, useRegister } from "api";
import { Screen } from "components";
import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { Text } from "tamagui";
import { Image } from "types";

import { RegisterForm } from "./registerForm";
import { RegisterSchema } from "./registerSchema";

export interface RegisterValues {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  height: number;
  weight: number;
  weightUnit: "kilograms" | "pounds";
  measurementUnit: "metric" | "imperial";
  age: number;
  maxes: Record<string, { reps: number; weight: number }>;
  avatar: Image | null;
}

export interface RegisterProps {
  form: FormikProps<RegisterValues>;
}

const RegisterScreen = () => {
  const { data: exercises } = useExercises({ retrieveImages: false });
  const { isLoading: registering, mutate: register } = useRegister();
  const [index, setIndex] = useState(0);

  const onSubmit = (registrationDetails: RegisterValues) => {
    register({
      ...registrationDetails,
      buddyName: registrationDetails.username,
      age: 0,
      height: 0,
      weight: 0,
    });
  };

  return (
    <Screen scrollable>
      <Formik
        validationSchema={RegisterSchema}
        validateOnChange
        enableReinitialize
        initialValues={
          {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            weightUnit: "kilograms",
            measurementUnit: "metric",
            height: 0,
            weight: 0,
            age: 0,
            maxes: {},
          } as RegisterValues
        }
        onSubmit={onSubmit}
      >
        {(form) => <RegisterForm form={form} exercises={exercises ?? []} />}
      </Formik>
    </Screen>
  );
};

const MemoizedScreen = React.memo(RegisterScreen);
export { MemoizedScreen as Register };
