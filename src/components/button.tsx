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
  let pressColor: string;
  let textColor: string;
  let outline: string | undefined;
  const disabled = isLoading === true || props.disabled === true;

  switch (variant) {
    case "primary":
      color = disabled ? "$gray300" : "$primary500";
      textColor = "white";
      pressColor = "$primary200";
      outline = undefined;
      break;
    case "link":
      color = "transparent";
      textColor = disabled ? "$gray300" : "$primary500";
      pressColor = "$gray200";
      outline = undefined;
      break;
    case "secondary":
      color = "transparent";
      textColor = disabled ? "$gray300" : "$primary500";
      outline = disabled ? "$gray300" : "$primary500";
      pressColor = "transparent";
      break;
    default:
      color = "$primary500";
      textColor = "white";
      pressColor = "$primary200";
  }

  if (isLoading) {
    return (
      <BaseButton
        disabled
        color={textColor}
        backgroundColor={color}
        icon={
          <Spinner
            mx="auto"
            pos="absolute"
            size="large"
            backgroundColor={color}
          />
        }
        {...props}
      >
        {" "}
      </BaseButton>
    );
  }

  return (
    <BaseButton
      pressStyle={{
        backgroundColor: pressColor,
      }}
      color={textColor}
      backgroundColor={color}
      {...props}
    >
      {props.children}
    </BaseButton>
  );
};
