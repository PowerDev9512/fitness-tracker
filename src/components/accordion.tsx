import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScrollView, Stack, XStack } from "tamagui";

import { Heading } from "./heading";
import { IconButton } from "./iconButton";

interface Props {
  children: React.ReactNode;
  title: string;
  secondTitle?: string;
  short?: boolean;
}

const InternalAccordion = ({
  title,
  children,
  short = false,
  secondTitle = undefined,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const maxHeight = short ? 125 : 200;

  const fadeAnimation = useSharedValue(0);
  const fadeStyle = useAnimatedStyle(() => ({
    height: withSpring(fadeAnimation.value),
  }));

  const rotateAnimation = useSharedValue(0);
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 16,
    marginBottom: -8,
  }));

  const handlePress = () => {
    setIsOpen(!isOpen);
    rotateAnimation.value = withSpring(isOpen ? 0 : 180);
    fadeAnimation.value = withSpring(isOpen ? 15 : maxHeight, {
      overshootClamping: true,
      damping: 20,
      stiffness: 100,
    });
  };

  return (
    <Stack>
      <XStack>
        <Heading accessibilityLabel={title}>{title}</Heading>
        {secondTitle && <Heading ml="auto">{secondTitle}</Heading>}
      </XStack>

      <Animated.View style={fadeStyle}>
        <ScrollView>{isOpen && children}</ScrollView>
      </Animated.View>

      <Animated.View style={rotateStyle}>
        <IconButton
          icon={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="$gray700"
          onPress={handlePress}
        />
      </Animated.View>
    </Stack>
  );
};

export const Accordion = React.memo(InternalAccordion);
