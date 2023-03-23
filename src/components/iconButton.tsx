import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Stack, useTheme } from "tamagui";

type BaseProps = {
  icon: string | React.ReactNode;
  color: string;
  size: number;
  onPress: () => void;
};

type Props = BaseProps &
  Omit<React.ComponentProps<typeof Stack>, keyof BaseProps>;

// this component is literally evil
export const IconButton = ({ icon, ...props }: Props) => {
  const theme = useTheme();

  const color =
    Object.entries(theme).find(
      (entry) =>
        entry[1].name ===
        (typeof props.color === "string"
          ? props.color.replace("$", "").trim()
          : "")
    )?.[1].val ?? theme.primary300.val;

  const size = typeof props.size === "number" ? props.size : 24;

  return (
    <Stack {...props}>
      {typeof icon === "string" && (
        <Icon onPress={props.onPress} name={icon} size={size} color={color} />
      )}
      {typeof icon !== "string" && icon}
    </Stack>
  );
};
