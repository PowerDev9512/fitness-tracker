import { styled, YStack } from "tamagui";

import { Loading } from "./loading";

interface Props {
  loading?: boolean;
  children: React.ReactNode;
}

const ScreenInternal = styled(YStack, {
  name: "MyStack",
  backgroundColor: "$backgroundStrong",
  flex: 1,
  padding: "$4",
  space: "$true",
});

export const Screen = ({ children, loading = false }: Props) => {
  return (
    <ScreenInternal>
      {loading && <Loading />}
      {!loading && children}
    </ScreenInternal>
  );
};
