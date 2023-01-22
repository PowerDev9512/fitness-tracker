import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "components";
import React from "react";
import { Pressable } from "react-native";
import { Heading, Image, Text } from "tamagui";

import { Login } from "./components/login/login";
import { Header, SubHeader } from "./components/login/login.styles";

export const Home = ({
  navigation,
}: NativeStackScreenProps<MainStackParams, "Home">) => {
  return (
    <Screen>
      <Header> Pocket Coach </Header>
      <SubHeader>
        {" "}
        Sign in or register below to start your fitness journey{" "}
      </SubHeader>

      <Image
        accessibilityLabel="Sign Up Logo"
        width={300}
        height={325}
        mx="auto"
        src={require("../../assets/images/otherlogo.png")}
        style={{ backgroundColor: "transparent" }}
      />

      <Login />

      <Pressable onPress={() => navigation.navigate("Register" as never)}>
        <Text>
          Don&apos;t have an account?
          <Text fontWeight="bold" color="$primary300">
            {" "}
            Register here!
          </Text>
        </Text>
      </Pressable>
    </Screen>
  );
};
