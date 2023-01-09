import styled from "styled-components/native";
import { Select } from "tamagui";

export const Dropdown = styled(Select)``;

Dropdown.defaultProps = {
  variant: "unstyled",
  textAlign: "right",
  py: -2,
  backgroundColor: "transparent",
  _text: {
    fontSize: "sm",
    color: "black",
    highlight: false,
  },
};
