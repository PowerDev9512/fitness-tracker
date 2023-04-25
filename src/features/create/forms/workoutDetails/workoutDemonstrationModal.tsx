import { IconButton, Modal } from "components";
import FastImage from "react-native-fast-image";
import { Stack, Text } from "tamagui";

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
        h="70%"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        mx="auto"
        my="auto"
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
        <FastImage
          source={{ uri: url }}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
            marginHorizontal: "auto",
          }}
        />
      </Stack>
    </Modal>
  );
};
