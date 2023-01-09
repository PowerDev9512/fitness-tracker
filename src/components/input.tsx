import { Eye, EyeOff } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Button, Input as InputBase } from "tamagui";

interface InputProps {
  value: string | number | undefined;
  onChangeText: (value: string) => void;
  onBlur?: (value: any) => void;
  placeholder: string | undefined;
  type: "text" | "password";
}

type Props = Omit<React.ComponentProps<typeof InputBase>, "value"> & InputProps;

const AnimatedInput = Animated.createAnimatedComponent(InputBase);

export function Input({
  value,
  onChangeText,
  placeholder,
  type,
  onBlur = () => {},
  ...props
}: Props) {
  const [hidden, setHidden] = useState(type === "password");

  const borderAnimation = useSharedValue(0);
  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnimation.value,
      [0, 1],
      ["$gray400", "$primary500"]
    ),
    borderWidth: withSpring(borderAnimation.value),
  }));

  const handleFocus = () => {
    borderAnimation.value = 1.2;
  };

  const handleBlur = (val: any) => {
    onBlur(value);
    borderAnimation.value = -2;
  };

  let valueAsString;

  if (typeof value === "number" && !Number.isNaN(value)) {
    valueAsString = value.toString();
  }
  if (typeof value === "number" && Number.isNaN(value)) {
    valueAsString = "";
  }
  if (typeof value === "string") {
    valueAsString = value;
  }
  if (typeof value === "undefined") {
    valueAsString = "";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // todo
  const rightElement =
    type === "password" ? (
      <Button
        onPress={() => setHidden(!hidden)}
        icon={hidden ? <EyeOff /> : <Eye />}
      />
    ) : undefined;

  return (
    <AnimatedInput
      accessibilityLabel={`${value} input`}
      value={valueAsString}
      onChangeText={onChangeText}
      borderRadius={10}
      onBlur={handleBlur}
      caretHidden={false}
      placeholder={placeholder}
      color="$black"
      style={borderStyle}
      onFocus={handleFocus}
      {...props}
    />
  );
}
