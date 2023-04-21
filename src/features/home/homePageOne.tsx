import { Button } from "components";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import { Stack, Text } from "tamagui";

import { Heading } from "../../components/heading";

interface Props {
  onNext: () => void;
}

export const HomePageOne = ({ onNext }: Props) => {
  return (
    <View
      key={1}
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 50,
        marginBottom: 6.5,
        width: "100%",
      }}
    >
      <Heading textAlign="center" mx="auto">
        Welcome to Pocket Coach
      </Heading>
      <Text fontSize={16} textAlign="center" mx="auto">
        Track your exercises with ease and get the most out of your workouts
      </Text>
      <Stack
        w="120%"
        h="60%"
        justifyContent="center"
        alignItems="center"
        mr="$10"
        mt="auto"
      >
        <FastImage
          source={require("../../assets/images/tracker.png")}
          style={{ width: "120%", height: "100%" }}
          resizeMode="contain"
        />
      </Stack>
      <Button mt="auto" onPress={onNext}>
        Next
      </Button>
    </View>
  );
};
