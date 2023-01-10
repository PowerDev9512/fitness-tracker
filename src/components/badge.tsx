import React from "react";
import { Spinner, Stack } from "tamagui";

interface Props {
  onClick?: () => void;
  loading?: boolean;
  side: "left" | "right";
  children: React.ReactNode;
  background?: boolean;
}

export function Badge({
  onClick,
  loading,
  children,
  side,
  background = true,
}: Props) {
  return (
    <Stack
      accessibilityLabel="badge"
      onTouchStart={onClick}
      zIndex={1}
      alignSelf="flex-end"
      position="absolute"
      top="1"
      right={side === "right" ? "2" : undefined}
      left={side === "left" ? "2" : undefined}
    >
      {loading && <Spinner color="$primary300" />}
      {!loading && children}
    </Stack>
  );
}
