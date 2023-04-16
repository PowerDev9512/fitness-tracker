import { IconButton, Modal } from "components";
import { Image, Stack, Text } from "tamagui";

interface Props {
  url: string;
  onClose: () => void;
  isOpen: boolean;
}

export const WorkoutDemonstrationModal = ({ url, isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Stack
        w="80%"
        h="40%"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
      >
        <IconButton
          pos="absolute"
          zIndex={10}
          top={0}
          right={10}
          bottom={0}
          icon="close"
          onPress={onClose}
          color="gray400"
          size={32}
        />
        <Image
          src={url}
          marginHorizontal="auto"
          marginBottom="$3"
          width="100%"
          height="100%"
        />
      </Stack>
    </Modal>
  );
};
