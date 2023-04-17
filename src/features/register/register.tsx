import { useExercises, useRegister } from "api";
import { Screen } from "components";
import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { Text } from "tamagui";
import { Image } from "types";

import { BuddyForm } from "./forms/buddy/buddyForm";
import { RegisterForm } from "./forms/details/registerForm";
import { StatsForm } from "./forms/stats/statsForm";
import { NavigationButton } from "./navigationButton";
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
    });
  };

  const getStep = (props: RegisterProps) => {
    switch (index) {
      case 0:
        return <RegisterForm form={props.form} />;
      case 1:
        return <BuddyForm form={props.form} />;
      case 2:
        return <StatsForm form={props.form} exercises={exercises ?? []} />;
      default:
        return <Text>Well, this is awkward</Text>;
    }
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
        {(form) => (
          <>
            {getStep({ form })}
            <NavigationButton
              loading={registering}
              disabled={Object.keys(form.errors).length > 0}
              currentIndex={index}
              setIndex={setIndex}
              onSubmit={form.handleSubmit}
            />
          </>
        )}
      </Formik>
    </Screen>
  );
};

const MemoizedScreen = React.memo(RegisterScreen);
export { MemoizedScreen as Register };
