import { Button } from "components";
import { View, Image } from "react-native";
import FastImage from "react-native-fast-image";
import { SvgUri } from "react-native-svg";
import { Stack, Text } from "tamagui";

import { Heading } from "../../components/heading";

interface Props {
  onNext: () => void;
}

export const HomePageTwo = ({ onNext }: Props) => {
  return (
    <View
      key={2}
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 50,
        marginBottom: 6.5,
        width: "100%",
      }}
    >
      <Heading textAlign="center" mx="auto">
        Simplifying your fitness journey
      </Heading>
      <Text textAlign="center" fontSize={16} mx="auto">
        Gain stats, levels and achievements based on your workouts
      </Text>
      <Stack
        w="100%"
        h="60%"
        justifyContent="center"
        alignItems="center"
        mr="$10"
        mt="auto"
      >
        <FastImage
          source={require("../../assets/images/health.png")}
          style={{ width: "110%", height: "100%" }}
          resizeMode="contain"
        />
      </Stack>
      <Button mt="auto" onPress={onNext}>
        Get Started
      </Button>
    </View>
  );
};
