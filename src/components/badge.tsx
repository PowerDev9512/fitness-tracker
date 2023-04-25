import React from "react";
import { Spinner, Stack } from "tamagui";

interface Props {
  onClick?: () => void;
  loading?: boolean;
  side: "left" | "right";
  children: React.ReactNode;
  background?: boolean;
  offset?: number;
}

export const Badge = ({
  onClick,
  loading,
  children,
  side,
  offset = 0,
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
      right={side === "right" ? 20 + offset : undefined}
      left={side === "left" ? 20 + offset : undefined}
    >
      {loading && <Spinner color="$primary300" />}
      {!loading && children}
    </Stack>
  );
};
