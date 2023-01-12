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
  name: "MyStack",
  transparent: true,
  animationType: "slide",
});

// todo: replace outer stack with blurview
export const Modal = ({ isOpen, onClose, children, ...props }: Props) => {
  return (
    <ModalInternal onRequestClose={onClose} visible={isOpen} {...props}>
      <Stack backgroundColor="rgba(0, 0, 0, 0.5)" h="100%" w="100%">
        <Stack ml="auto" mr="$3.5" w="85%" h="60%" my="auto">
          {children}
        </Stack>
      </Stack>
    </ModalInternal>
  );
};
