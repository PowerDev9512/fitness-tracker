import { useLogin } from "api";
import { Button, FormInput } from "components";
import { Formik } from "formik";
import React from "react";
import { Stack } from "tamagui";

import * as SC from "./login.styles";
import { LoginSchema } from "./loginSchema";

export interface LoginValues {
  email: string;
  password: string;
}

export const Login = () => {
  const { mutate } = useLogin();

  const onSubmit = ({ email, password }: LoginValues) => {
    mutate({ email, password });
  };

  return (
    <Stack w="100%">
      <Formik
        validationSchema={LoginSchema}
        validateOnChange
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <SC.Container>
            <FormInput
              required
              hideLabel
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email && touched.email ? errors.email : undefined}
              name="Email"
            />
            <FormInput
              required
              type="password"
              error={
                errors.password && touched.password
                  ? errors.password
                  : undefined
              }
              hideLabel
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              name="Password"
            />
            <Button
              disabled={!(values.email && values.password)}
              onPress={() => handleSubmit()}>Sign In</Button>
          </SC.Container>
        )}
      </Formik>
    </Stack>
  );
};
