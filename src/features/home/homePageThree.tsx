import { useNavigation } from "@react-navigation/native";
import { useLogin } from "api";
import { Heading, FormInput, Button } from "components";
import { useMemo, useState } from "react";
import { View, Image, Pressable } from "react-native";
import { SvgUri } from "react-native-svg";
import { Text, YStack } from "tamagui";

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
        marginBottom: 0,
        width: "100%",
      }}
    >
      <Heading mx="auto" fontSize={30}>
        Login to your account
      </Heading>
      <Text textAlign="center" fontSize={16} mx="auto">
        Or register below to start your fitness journey
      </Text>
      <SvgUri
        uri={
          Image.resolveAssetSource(require("../../assets/images/stats.svg")).uri
        }
        width="100%"
        height="65%"
      />
      <YStack space="$3" mt="$-7">
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
        onPress={() => onSubmit(email, password)}
        disabled={email.length === 0 || password.length === 0}
      >
        {loggingIn ? "Logging in..." : "Login"}
      </Button>
      <Pressable
        style={{ alignSelf: "center" }}
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Text>
          Don&apos;t have an account?
          <Text fontWeight="bold" color="$primary300">
            {" "}
            Register here!
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};
