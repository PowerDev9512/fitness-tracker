import { useNavigation } from "@react-navigation/native";
import { useLogin } from "api";
import { Button, FormInput } from "components";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { useStore } from "store";
import { View } from "tamagui";

import * as SC from "./login.styles";
import { LoginSchema } from "./loginSchema";

export interface LoginValues {
  email: string;
  password: string;
}

export function Login() {
  const { isLoading, mutate } = useLogin();
  const { userId } = useStore();
  const navigation = useNavigation();

  const onSubmit = ({ email, password }: LoginValues) => {
    mutate({ email, password });
  };

  useEffect(() => {
    if ((userId ?? -1) >= 0) {
      navigation.navigate("Drawer" as never);
    }
  }, [navigation, userId]);

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
            <Button isLoading={isLoading} onPress={handleSubmit}>
              Sign In
            </Button>
          </SC.Container>
        )}
      </Formik>
    </Stack>
  );
}
