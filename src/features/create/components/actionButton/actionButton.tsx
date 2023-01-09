import { Button } from "components";
import React from "react";
import { Text } from "tamagui";

interface BaseProps {
  title: string;
}

type Props = BaseProps & Omit<React.ComponentProps<typeof Button>, "children">;

export const ActionButton = ({ title, ...rest }: Props) => {
  return (
    <Button {...rest} variant="link">
      <Text color="black" fontSize="2xs">
        {title}
      </Text>
    </Button>
  );
};
