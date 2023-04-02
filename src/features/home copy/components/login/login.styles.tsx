import { Heading, styled, YStack } from "tamagui";

export const Container = styled(YStack, {
  space: 4,
  width: "90%",
  alignContent: "center",
  marginHorizontal: "auto",
});

export const Header = styled(Heading, {
  mt: "$6",
  size: "$10",
  fontWeight: "bold",
  textAlign: "center",
});

export const SubHeader = styled(Heading, {
  size: "$6",
  textAlign: "center",
  color: "$gray700",
  mt: "$-4",
  fontWeight: "normal",
});
