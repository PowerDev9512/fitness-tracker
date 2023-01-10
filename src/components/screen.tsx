import { ScrollView, styled, YStack } from "tamagui";

import { Loading } from "./loading";

interface Props {
  loading?: boolean;
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
});

const ScrollScreenInternal = styled(ScrollView, {
  name: "ScreenInternal",
  backgroundColor: "$backgroundStrong",
  flex: 1,
  padding: "$4",
  space: "$true",
});

export const Screen = ({
  children,
  scrollable = false,
  extraSpace = false,
  loading = false,
}: Props) => {
  if (scrollable) {
    return (
      <ScrollScreenInternal mb={extraSpace ? 10 : 0}>
        {loading && <Loading />}
        {!loading && children}
      </ScrollScreenInternal>
    );
  }

  return (
    <ScreenInternal mb={extraSpace ? 10 : 0}>
      {loading && <Loading />}
      {!loading && children}
    </ScreenInternal>
  );
};
