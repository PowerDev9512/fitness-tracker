import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import React from "react";
import { Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { Image } from "types";

interface BaseProps {
  children: React.ReactNode;
  disabled?: boolean;
  callbacks: ((image: Image) => void)[];
}

type Props = BaseProps & React.ComponentProps<typeof Pressable>;

export const ImagePicker = ({
  children,
  callbacks,
  disabled = false,
  ...props
}: Props) => {
  const [permissions, requestPermission] = useMediaLibraryPermissions();

  const pickImage = () => {
    if (permissions?.status === "granted") {
      launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      }).then((result) => {
        if (result && !result.canceled) {
          const asset = result.assets[0];
          const newImage = {
            bytes: asset.base64,
            name: "avatar",
            fileExtension: asset.uri.split(".").pop(),
          } as Image;

          callbacks.forEach((callback) => {
            callback(newImage);
          });
        }
      });
    } else {
      requestPermission().then((result) => {
        if (result.status !== "granted") {
          Toast.show({
            text1: "Permission required",
            text2: "Permission to access camera roll is required",
            type: "info",
          });
        }
      });
    }
  };

  return (
    <Pressable onPress={disabled ? null : pickImage} {...props}>
      {children}
    </Pressable>
  );
};
