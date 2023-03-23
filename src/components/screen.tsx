import React from "react";
import { ScrollView, styled, YStack } from "tamagui";

interface Props {
  extraSpace?: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
}

const ScreenInternal = styled(YStack, {
  name: "ScreenInternal",
  backgroundColor: "$backgroundAccent",
  flex: 1,
  padding: "$4",
  space: "$true",
  alignContent: "center",
  alignItems: "center",
});

const ScrollScreenInternal = styled(ScrollView, {
  name: "ScreenInternal",
  backgroundColor: "$backgroundAccent",
  flex: 1,
  padding: "$4",
  space: "$true",
});

ScrollScreenInternal.defaultProps = {
  contentContainerStyle: {
    alignContent: "center",
    alignItems: "center",
  },
};

export const Screen = ({
  children,
  scrollable = false,
  extraSpace = false,
}: Props) => {
  if (scrollable) {
    return (
      <ScrollScreenInternal>
        {children}
        {extraSpace && <YStack h={100} space="$true" />}
      </ScrollScreenInternal>
    );
  }

  return (
    <ScreenInternal>
      {children}
      {extraSpace && <YStack h={100} space="$true" />}
    </ScreenInternal>
  );
};
