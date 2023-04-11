import { LinearGradient } from "@tamagui/linear-gradient";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  interpolate,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Stack, styled, useTheme, YStack } from "tamagui";

type Props = Omit<React.ComponentProps<typeof YStack>, "children"> & {
  isLoading?: boolean;
};

const SkeletonInternal = styled(Stack, {
  name: "SkeletonInternal",
  backgroundColor: "$white",
  w: "90%",
  h: "100%",
  mr: "auto",
  borderRadius: 10,
});

export const Skeleton = ({ isLoading = true, ...props }: Props) => {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = {
    transform: [{ translateX: progress.value }],
  };

  const start = { x: 0, y: 0 };
  const end = { x: interpolate(progress.value, [0, 1], [0, 1]), y: 0 };

  return (
    <SkeletonInternal {...props}>
      <Animated.View style={animatedStyle}>
        <LinearGradient
          w="100%"
          h="100%"
          borderRadius={10}
          start={start}
          end={end}
          colors={[theme.gray200.val, theme.gray400.val, theme.gray200.val]}
        />
      </Animated.View>
    </SkeletonInternal>
  );
};
