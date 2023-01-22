import React from "react";
import { ScrollView, styled, YStack } from "tamagui";

import { Loading } from "./loading";

interface Props {
  extraSpace?: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
}

const ScreenInternal = styled(YStack, {
  name: "ScreenInternal",
  backgroundColor: "$backgroundStrong",
  flex: 1,
  padding: "$4",
  space: "$true",
  alignContent: "center",
  alignItems: "center",
});

const ScrollScreenInternal = styled(ScrollView, {
  name: "ScreenInternal",
  backgroundColor: "$backgroundStrong",
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
      <ScrollScreenInternal mb={extraSpace ? "$5" : "$0"}>
        {children}
      </ScrollScreenInternal>
    );
  }

  return (
    <ScreenInternal mb={extraSpace ? "$5" : "$0"}>{children}</ScreenInternal>
  );
};
