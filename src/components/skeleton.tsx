import { styled, YStack } from "tamagui";

type Props = Omit<React.ComponentProps<typeof YStack>, "children">;

const SkeletonInternal = styled(YStack, {
  name: "SkeletonInternal",
  backgroundColor: "$backgroundStrong",
});

export const Skeleton = ({ ...props }: Props) => {
  return <SkeletonInternal {...props} />;
};
