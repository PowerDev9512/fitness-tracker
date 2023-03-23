import React from "react";
import { Button as BaseButton, Spinner, Stack } from "tamagui";

type Variant = "primary" | "secondary" | "link";

interface BaseProps {
  variant?: Variant;
  isLoading?: boolean;
}

type Props = BaseProps & React.ComponentProps<typeof BaseButton>;

export const Button = ({
  variant = "primary",
  isLoading = false,
  ...props
}: Props) => {
  let color: string;
  let textColor: string;
  let outline: string | undefined;
  let disabled = props.disabled ?? false;

  switch (variant) {
    case "primary":
      color = disabled ? "$gray300" : "$primary500";
      textColor = "white";
      outline = undefined;
      break;
    case "link":
      color = "transparent";
      textColor = disabled ? "$gray300" : "$primary500";
      outline = undefined;
      break;
    case "secondary":
      color = "transparent";
      textColor = disabled ? "$gray300" : "$primary500";
      outline = disabled ? "$gray300" : "$primary500";
    default:
      color = "$primary500";
      textColor = "white";
  }

  if (isLoading) {
    return (
      <BaseButton
        disabled={true}
        backgroundColor={color}
        icon={<Spinner mx="auto" pos="absolute" backgroundColor={color} />}
        als="center"
        {...props}
      />
    );
  }

  return (
    <BaseButton
      pressStyle={{
        backgroundColor: disabled ? color : "$primary200",
      }}
      color={textColor}
      backgroundColor={color}
      {...props}
    >
      {props.children}
    </BaseButton>
  );
};
