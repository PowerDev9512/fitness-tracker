import React from "react";
import FastImage from "react-native-fast-image";
import { Dirs } from "react-native-file-access";
import RNFetchBlob from "rn-fetch-blob";

interface BaseProps {
  fileName: string;
  alt: string;
}

type Props = BaseProps &
  Omit<React.ComponentProps<typeof FastImage>, keyof BaseProps>;

export const CachedImage = ({ fileName, alt, ...props }: Props) => {
  const [image, setImage] = React.useState("");

  const nameInDir = `${Dirs.DocumentDir}/${fileName}`;

  RNFetchBlob.fs.readFile(nameInDir, "base64").then((data) => setImage(data));

  return (
    <FastImage
      {...props}
      resizeMode={FastImage.resizeMode.stretch}
      source={{ uri: `data:image/png;base64,${image}` }}
    />
  );
};
