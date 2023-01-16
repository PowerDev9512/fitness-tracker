import { Button, IconButton } from "components";
import React from "react";
import { Text } from "tamagui";

interface BaseProps {
  title: string;
}

type Props = BaseProps & Omit<React.ComponentProps<typeof Button>, "children">;

export const ActionButton = ({ title, ...rest }: Props) => {
  return (
    <IconButton {...rest}>
      <Text color="black" fontSize={12}>
        {title}
      </Text>
    </IconButton>
  );
};
