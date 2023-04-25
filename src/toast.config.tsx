import { StyleProp, TextStyle } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const text1Style: StyleProp<TextStyle> = {
  fontSize: 14,
  flexWrap: "wrap",
};

const text2Style: StyleProp<TextStyle> = {
  fontSize: 12,
};

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", borderLeftWidth: 10 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={text1Style}
      text2Style={text2Style}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderLeftWidth: 10 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={text1Style}
      text2Style={text2Style}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
};
