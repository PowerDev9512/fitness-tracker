import React from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "tamagui";

interface BaseProps {
  value: string;
  onValueChange: (value: string) => void;
  checked: boolean;
}

type Props = BaseProps & React.ComponentProps<typeof Pressable>;

export const RadioButton = ({ value, onValueChange, checked }: Props) => {
  const theme = useTheme();

  const widthAndHeight = useSharedValue(10);
  const widthAndHeightOuter = useSharedValue(20);

  const style = useAnimatedStyle(() => ({
    width: withTiming(widthAndHeight.value, {
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
    height: withTiming(widthAndHeight.value, {
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  const outerStyle = useAnimatedStyle(() => ({
    width: withTiming(widthAndHeightOuter.value, {
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
    height: withTiming(widthAndHeightOuter.value, {
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  return (
    <Pressable
      onPress={() => {
        widthAndHeight.value = 12;
        widthAndHeightOuter.value = 22;
        onValueChange(value);
      }}
      onPressOut={() => {
        widthAndHeight.value = 10;
        widthAndHeightOuter.value = 20;
      }}
    >
      <Animated.View
        style={[
          outerStyle,
          {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "gray",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
          },
        ]}
      >
        {checked ? (
          <Animated.View
            style={[
              style,
              {
                backgroundColor: theme.primary500.val,
                borderRadius: 10,
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
};
