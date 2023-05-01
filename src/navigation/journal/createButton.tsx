import { useNavigation } from "@react-navigation/native";
import { IconButton } from "components";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Text, XStack } from "tamagui";

interface Props {
  onButton2Press: () => void;
}

export const CreateButton = ({ onButton2Press: onButton1Press }: Props) => {
  const navigation = useNavigation();

  const button1Y = useSharedValue(0);
  const button2Y = useSharedValue(0);

  const onPress = () => {
    if (button1Y.value !== 0 && button2Y.value !== 0) {
      button1Y.value = withTiming(0);
      button2Y.value = withTiming(0);
    } else {
      button1Y.value = withTiming(-90);
      button2Y.value = withTiming(-160);
    }
  };

  const button1Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: button1Y.value }],
      opacity: interpolate(button1Y.value, [0, -90], [0, 1]),
    };
  });

  const button2Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: button2Y.value }],
      opacity: interpolate(button2Y.value, [0, -160], [0, 1]),
    };
  });

  return (
    <>
      <Animated.View style={[button1Style]}>
        <Text
          position="absolute"
          bottom={108}
          right={80}
          color="$primary500"
          zIndex={2}
        >
          Recommend Workout
        </Text>

        <IconButton
          position="absolute"
          bottom={92}
          right={22}
          size={50}
          color="$primary500"
          icon="logo-ionitron"
          zIndex={2}
          onPress={() => onButton1Press()}
        />
      </Animated.View>
      <Animated.View style={[button2Style]}>
        <Text
          position="absolute"
          bottom={108}
          right={80}
          color="$primary500"
          zIndex={1}
        >
          Create Workout
        </Text>
        <IconButton
          position="absolute"
          bottom={92}
          right={18}
          size={52}
          color="$primary500"
          icon="md-create-outline"
          zIndex={1}
          onPress={() => navigation.navigate("Create" as never)}
        />
      </Animated.View>
      <IconButton
        position="absolute"
        bottom={92}
        right={10}
        size={70}
        color="$primary500"
        icon="add-circle"
        zIndex={3}
        onPress={onPress}
      />
    </>
  );
};
