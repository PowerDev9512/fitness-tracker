import { Select } from "components";
import { styled } from "tamagui";

export const Dropdown = styled(Select);

Dropdown.defaultProps = {
  py: -2,
  backgroundColor: "transparent",
};
