import { useNavigation } from "@react-navigation/native";
import { useLogin } from "api";
import { Heading, FormInput, Button } from "components";
import { useMemo, useState } from "react";
import { View, Image, Pressable, Linking } from "react-native";
import FastImage from "react-native-fast-image";
import { SvgUri } from "react-native-svg";
import { Stack, Text, YStack } from "tamagui";
import { Mixpanel } from "utils";

export const HomePageThree = () => {
  const navigation = useNavigation();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { mutate, isLoading: loggingIn } = useLogin();

  const onSubmit = (email: string, password: string) => {
    mutate({ email: email.trim().toLowerCase(), password });
  };

  const errors = useMemo(() => {
    const errors: Record<string, string[]> = {
      email: [],
      password: [],
    };

    if (email.length === 0) {
      errors.email.push("Email is required");
    }

    if (password.length === 0) {
      errors.password.push("Password is required");
    }

    if (password.length > 0 && password.length < 6) {
      errors.password.push("Password must be at least 6 characters");
    }

    if (email.length > 0 && !email.includes("@")) {
      errors.email.push("Email must be valid");
    }

    return errors;
  }, [email, password]);

  return (
    <View
      key={3}
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 50,
        marginBottom: 65,
        width: "100%",
      }}
    >
      <Heading textAlign="center" mx="auto" fontSize={30}>
        Login to your account
      </Heading>
      <Text textAlign="center" fontSize={16} mx="auto">
        Or register below to start your fitness journey right now!
      </Text>
      <Stack
        w="100%"
        h="30%"
        justifyContent="center"
        alignItems="center"
        mt="$3"
        mb="$3"
      >
        <FastImage
          source={require("../../assets/images/stats.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </Stack>
      <YStack space="$3">
        <FormInput
          required
          hideLabel
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          onBlur={(text) => setEmail(text)}
          value={email}
          error={errors.email.join(", ")}
          name="Email"
        />
        <FormInput
          required
          type="password"
          error={errors.password.join(", ")}
          hideLabel
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          onBlur={(text) => setPassword(text)}
          value={password}
          name="Password"
        />
      </YStack>
      <Button
        mb="$2"
        mt="$4"
        onPress={() => {
          Mixpanel.track("Login Button Pressed");
          return onSubmit(email, password);
        }}
        disabled={email.length === 0 || password.length === 0}
      >
        {loggingIn ? "Logging in..." : "Login"}
      </Button>
      <Pressable
        style={{ alignSelf: "center" }}
        onPress={() => {
          Mixpanel.track("Register Button Pressed");
          return navigation.navigate("Register" as never);
        }}
      >
        <Text>
          Don&apos;t have an account?
          <Text fontWeight="bold" color="$primary300">
            {" "}
            Register here!
          </Text>
        </Text>
      </Pressable>
      <Pressable
        onPress={() =>
          Linking.openURL(
            "https://thed24.github.io/fitness-tracker-site/privacy"
          )
        }
      >
        <Text textAlign="center" mb="$2" color="$primary300">
          Or, view our
          <Text fontWeight="bold" color="$primary300">
            {" "}
            Privacy Policy
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};
