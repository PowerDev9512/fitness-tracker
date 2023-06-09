import { BlurView } from "@react-native-community/blur";
import React from "react";
import { Modal as ModalBase } from "react-native";
import { Stack, styled } from "tamagui";

interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

type Props = BaseProps & React.ComponentProps<typeof ModalInternal>;

const ModalInternal = styled(ModalBase, {
  name: "Modal",
  transparent: true,
  animationType: "fade",
});

export const Modal = ({ isOpen, onClose, children, ...props }: Props) => {
  return (
    <ModalInternal onRequestClose={onClose} visible={isOpen} {...props}>
      <Stack
        backgroundColor="rgba(0, 0, 0, 0.7)"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Stack w="90%">{children}</Stack>
      </Stack>
    </ModalInternal>
  );
};
