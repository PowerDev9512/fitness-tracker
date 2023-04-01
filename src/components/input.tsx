import { Eye, EyeOff } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Input as InputBase, Stack } from "tamagui";

import { Button } from "./button";

interface InputProps {
  value: string | number | undefined;
  onChangeText: (value: string) => void;
  onBlur?: (value: any) => void;
  rightElement?: React.ReactNode;
  placeholder: string | undefined;
  type: "text" | "password";
}

type Props = Omit<React.ComponentProps<typeof InputBase>, "value"> & InputProps;

export const Input = ({
  value,
  onChangeText,
  placeholder,
  type,
  rightElement,
  onBlur = () => {},
  ...props
}: Props) => {
  const [hidden, setHidden] = useState(type === "password");

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

  const createRightElement = () => {
    if (rightElement) {
      return rightElement;
    }

    return type === "password" ? (
      <Button
        position="absolute"
        right={0}
        backgroundColor="transparent"
        color="$gray500"
        pressStyle={{
          backgroundColor: "transparent",
        }}
        onPress={() => setHidden(!hidden)}
        icon={hidden ? <EyeOff /> : <Eye />}
      />
    ) : undefined;
  };

  return (
    <Stack w={props.w ?? props.width ?? "100%"}>
      <InputBase
        accessibilityLabel={`${value} input`}
        value={valueAsString}
        onChangeText={onChangeText}
        borderRadius={10}
        caretHidden={false}
        placeholder={placeholder}
        placeholderTextColor="gray"
        backgroundColor="$white"
        color="black"
        secureTextEntry={hidden}
        {...props}
        w="100%"
      />
      {createRightElement()}
    </Stack>
  );
};
