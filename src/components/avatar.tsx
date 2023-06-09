import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
import FastImage from "react-native-fast-image";
import { Stack } from "tamagui";
import { Badge, Image as ImageType, OtherUser, User } from "types";

import { ImagePicker } from "./imagePicker";

interface BaseProps {
  size: "sm" | "ms" | "md" | "lg" | "xl" | "2xl";
  callback: (image: ImageType) => void;
  user: User | OtherUser | null;
  badge?: Badge;
  editable?: boolean;
}

type Props = BaseProps & React.ComponentProps<typeof Stack>;

export const Avatar = ({
  user,
  size,
  callback,
  badge,
  editable = false,
  ...props
}: Props) => {
  const [image, setImage] = useState<ImageType | undefined>(undefined);

  const placeholderName = user?.username ?? "User";
  const avatar = image ?? user?.avatar;
  const userBadge = badge ?? user?.badge;

  let width = 0;
  let height = 0;

  switch (size) {
    case "sm":
      width = 25;
      height = 25;
      break;
    case "md":
      width = 50;
      height = 50;
      break;
    case "ms":
      width = 75;
      height = 75;
      break;
    case "lg":
      width = 100;
      height = 100;
      break;
    case "xl":
      width = 200;
      height = 200;
      break;
    case "2xl":
      width = 300;
      height = 300;
      break;
    default:
      width = 50;
      height = 50;
      break;
  }

  const avatarImage = useMemo(() => {
    const style = {
      width,
      height,
      borderRadius: width / 2,
      borderWidth: 1.5,
    };

    const tempImage =
      avatar !== null && avatar !== undefined ? (
        <FastImage
          style={style}
          accessibilityLabel={`Avatar for ${placeholderName}`}
          source={{
            uri: `data:image/${avatar.fileExtension};base64,${avatar.bytes}`,
          }}
        />
      ) : (
        <FastImage
          style={style}
          accessibilityLabel={`Avatar for ${placeholderName}`}
          source={{
            uri: `https://ui-avatars.com/api/?name=${placeholderName}&size=300`,
          }}
        />
      );

    return (
      <ImagePicker
        disabled={!editable}
        callbacks={[callback, setImage]}
        accessibilityLabel="Change avatar"
      >
        {tempImage}
      </ImagePicker>
    );
  }, [avatar, callback, editable, height, placeholderName, width]);

  const badgeImage = useMemo(() => {
    if (!userBadge) {
      return null;
    }

    const style = {
      width,
      height,
      top: 10,
      right: -75,
      borderRadius: width / 2,
      borderWidth: 2,
    };

    return (
      <Pressable onPress={() => {}}>
        <FastImage
          style={{ ...style, position: "absolute" }}
          accessibilityLabel={`Badge for ${placeholderName}`}
          source={{
            uri: `data:image/${userBadge.image.fileExtension};base64,${userBadge.image.bytes}`,
          }}
        />
      </Pressable>
    );
  }, [height, placeholderName, userBadge, width]);

  return (
    <Stack {...props}>
      {badgeImage}
      {avatarImage}
    </Stack>
  );
};
