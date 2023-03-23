import { IconButton } from "components";
import React from "react";
import { Text } from "tamagui";

interface BaseProps {
  title: string;
}

type Props = BaseProps & Omit<React.ComponentProps<typeof IconButton>, "icon">;

export const ActionButton = ({ title, ...rest }: Props) => {
  return (
    <IconButton
      {...rest}
      icon={
        <Text color="black" fontSize={12}>
          {title}
        </Text>
      }
    />
  );
};
