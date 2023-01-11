import React from "react";
import { Button as BaseButton, Spinner, Stack } from "tamagui";

interface BaseProps {
  variant?: "primary" | "link";
  isLoading?: boolean;
}

type Props = BaseProps & React.ComponentProps<typeof BaseButton>;

export const Button = ({
  variant = "primary",
  isLoading = false,
  ...props
}: Props) => {
  let color;
  let textColor;

  switch (variant) {
    case "primary":
      color = "$primary500";
      textColor = "white";
      break;
    case "link":
      color = "transparent";
      textColor = "black";
      break;
    default:
      color = "$primary500";
      textColor = "white";
  }

  return isLoading ? (
    <Stack>
      <Spinner mx="auto" pos="absolute" />
      <BaseButton color={textColor} backgroundColor={color} {...props} />
    </Stack>
  ) : (
    <BaseButton color={textColor} backgroundColor={color} {...props}>
      {props.children}
    </BaseButton>
  );
};
