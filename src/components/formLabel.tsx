import React from "react";
import { Text } from "tamagui";

interface BaseProps {
  children: React.ReactNode;
  textAlign?: "left" | "center" | "right";
  color?: string;
  variant?: "title" | "error";
}

type Props = BaseProps & React.ComponentProps<typeof Text>;

export function FormLabel({
  children,
  textAlign = "left",
  color = "black",
  variant = "title",
  ...props
}: Props) {
  let content = null;

  switch (variant) {
    case "title":
      content = (
        <Text
          accessibilityLabel={`${children} label`}
          color={color}
          textAlign={textAlign}
          mb={2}
          fontSize={16}
          fontWeight="bold"
          {...props}
        >
          {children}
        </Text>
      );
      break;
    case "error":
      content = (
        <Text
          accessibilityLabel={`${children} label`}
          textAlign={textAlign}
          fontSize={12}
          color="red"
        >
          {children}
        </Text>
      );
      break;
    default:
      content = null;
  }

  return content;
}
