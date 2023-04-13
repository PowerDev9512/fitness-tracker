import { Button } from "components";
import { View, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { Text } from "tamagui";

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
      <Heading mx="auto">Welcome to Pocket Coach</Heading>
      <Text fontSize={16} textAlign="center" mx="auto">
        Your personal fitness tracker and coach
      </Text>
      <SvgUri
        uri={
          Image.resolveAssetSource(require("../../assets/images/tracker.svg"))
            .uri
        }
        width="100%"
        height="80%"
      />
      <Button mt="auto" onPress={onNext}>
        Next
      </Button>
    </View>
  );
};
