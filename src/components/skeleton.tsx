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
  w: "100%",
  h: "100%",
  borderRadius: 10,
});

export const Skeleton = ({ isLoading = true, ...props }: Props) => {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 100, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const start = interpolate(progress.value, [0, 1], [-0.5, 0.5]);
  const end = interpolate(progress.value, [0, 1], [0.5, 1.5]);

  console.log(progress.value);

  return (
    <SkeletonInternal {...props}>
      <Animated.View>
        <LinearGradient
          w="100%"
          h="100%"
          borderRadius={10}
          start={{ x: start, y: 0 }}
          end={{ x: end, y: 0 }}
          colors={[theme.gray200.val, theme.gray400.val, theme.gray200.val]}
        />
      </Animated.View>
    </SkeletonInternal>
  );
};
