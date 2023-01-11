import { styled, YStack } from "tamagui";

export const Container = styled(YStack, {
  space: 4,
  width: "90%",
  alignContent: "center",
  marginHorizontal: "auto",
});

Container.defaultProps = {
  space: 4,
};
