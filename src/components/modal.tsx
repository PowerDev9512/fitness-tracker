import { Button, Stack, styled } from "tamagui";

interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

type Props = BaseProps & React.ComponentProps<typeof ModalInternal>;

const ModalInternal = styled(Stack, {
  name: "MyStack",
  backgroundColor: "$backgroundStrong",
  flex: 1,
  padding: "$4",
  space: "$true",
});

export const Modal = ({ isOpen, onClose, children, ...props }: Props) => {
  return <ModalInternal {...props}>{isOpen && children}</ModalInternal>;
};

const content = styled(Stack, {
  name: "ModalContent",
});

const closeButton = styled(Button, {
  name: "ModalCloseButton",
});

Modal.Content = content;
Modal.CloseButton = closeButton;
Modal.Header = content;
Modal.Body = content;
Modal.Footer = content;
