import { Button } from "components";
import { View, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { Text } from "tamagui";

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
      <Heading mx="auto">Simplyfing your fitness journey</Heading>
      <Text textAlign="center" fontSize={16} mx="auto">
        We gameify your goals and make them achievable
      </Text>
      <SvgUri
        uri={
          Image.resolveAssetSource(require("../../assets/images/health.svg"))
            .uri
        }
        width="100%"
        height="80%"
      />
      <Button mt="auto" onPress={onNext}>
        Get Started
      </Button>
    </View>
  );
};
