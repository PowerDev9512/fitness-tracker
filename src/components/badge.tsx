import React from "react";
import { Spinner, Stack } from "tamagui";

interface Props {
  onClick?: () => void;
  loading?: boolean;
  side: "left" | "right";
  children: React.ReactNode;
  background?: boolean;
}

export const Badge = ({
  onClick,
  loading,
  children,
  side,
  background = true,
}: Props) => {
  return (
    <Stack
      accessibilityLabel="badge"
      onTouchStart={onClick}
      zIndex={1}
      alignSelf="flex-end"
      position="absolute"
      top={50}
      right={side === "right" ? 20 : undefined}
      left={side === "left" ? 20 : undefined}
    >
      {loading && <Spinner color="$primary300" />}
      {!loading && children}
    </Stack>
  );
};
