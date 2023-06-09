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
  type: "text" | "password" | "number" | "email";
  characterLimit?: number;
}

type Props = Omit<React.ComponentProps<typeof InputBase>, "value"> & InputProps;

export const Input = ({
  value,
  onChangeText,
  placeholder,
  type,
  rightElement,
  onBlur = () => {},
  characterLimit = 100,
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

  let keyboardType: "default" | "numeric" | "email-address" = "default";

  switch (type) {
    case "text":
      keyboardType = "default";
      break;
    case "password":
      keyboardType = "default";
      break;
    case "number":
      keyboardType = "numeric";
      break;
    case "email":
      keyboardType = "email-address";
      break;
  }

  const createRightElement = () => {
    if (rightElement) {
      return rightElement;
    }

    return type === "password" ? (
      <Button
        accessibilityLabel="Toggle password visibility"
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
        maxLength={characterLimit}
        value={valueAsString}
        onChangeText={onChangeText}
        onBlur={onBlur}
        borderRadius={10}
        caretHidden={false}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="gray"
        backgroundColor="$white"
        color="black"
        secureTextEntry={hidden}
        {...props}
        w="100%"
        h={48}
      />
      {createRightElement()}
    </Stack>
  );
};
