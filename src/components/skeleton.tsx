import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { YStack } from "tamagui";

type Props = Omit<React.ComponentProps<typeof YStack>, "children"> & {
  isLoading?: boolean;
};

export const Skeleton = ({ isLoading = true, ...props }: Props) => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        marginVertical={5}
        height="90%"
        borderRadius={11}
      />
    </SkeletonPlaceholder>
  );
};
