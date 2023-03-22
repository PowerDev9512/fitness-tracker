import {
  themes as defaultThemes,
  tokens as defaultTokens,
} from "@tamagui/themes";
import { createTheme, createTokens } from "tamagui";

const tokens = createTokens({
  ...defaultTokens,
  color: {
    $blue100: "#82c7ff",
    $blue200: "#61b6fb",
    $blue300: "#43a5f5",
    $blue400: "#2196f3",
    $blue500: "#148aea",
    $blue600: "#187dd0",
    $blue700: "#1c71b7",
    $blue800: "#1e659f",
    $blue900: "#1f5988",
    $purple100: "#c7bfff",
    $purple200: "#b6aefb",
    $purple300: "#a59df5",
    $purple400: "#948cf3",
    $purple500: "#8a7cea",
    $purple600: "#7d71d0",
    $purple700: "#7161b7",
    $purple800: "#65529f",
    $purple900: "#594488",
    $gray50: "#f9fafb",
    $gray100: "#f5f7fa",
    $gray200: "#e4e7eb",
    $gray300: "#cbd2d9",
    $gray400: "#9aa5b1",
    $gray500: "#7b8794",
    $gray600: "#616e7c",
    $gray700: "#52606d",
    $gray800: "#3e4c59",
    $gray900: "#323f4b",
    $gray1000: "#1f2933",
    $white: "#ffffff",
    $softWhite: "#f8f8f8",
    $softerWhite: "#f2f2f2",
    $black: "#000000",
    $red100: "#ff8a8a",
    $red200: "#ff6b6b",
    $red300: "#ff4d4d",
    $red400: "#ff2e2e",
    $red500: "#ff0f0f",
    $red600: "#e60e0e",
    $red700: "#cc0d0d",
    $red800: "#b20c0c",
    $red900: "#990b0b",
    $green100: "#8aff8a",
    $green200: "#6bff6b",
    $green300: "#4dff4d",
    $green400: "#2eff2e",
    $green500: "#0fff0f",
    $green600: "#0ee60e",
    $green700: "#0dcc0d",
    $green800: "#0cb20c",
    $green900: "#0b990b",
  },
});

const lightTheme = createTheme({
  background: tokens.color.gray100,
  backgroundStrong: tokens.color.gray200,
  backgroundAccent: tokens.color.softerWhite,
  gray200: tokens.color.gray200,
  gray300: tokens.color.gray300,
  gray400: tokens.color.gray400,
  gray500: tokens.color.gray500,
  gray700: tokens.color.gray700,
  primary100: tokens.color.blue100,
  primary200: tokens.color.blue200,
  primary500: tokens.color.blue500,
  primary300: tokens.color.blue300,
  black: tokens.color.black,
  white: tokens.color.white,
  green: tokens.color.green100,
  red: tokens.color.red300,
});

type BaseTheme = typeof lightTheme;

const darkTheme: BaseTheme = createTheme({
  background: tokens.color.gray900,
  backgroundStrong: tokens.color.gray800,
  backgroundAccent: tokens.color.gray700,
  gray200: tokens.color.gray600,
  gray300: tokens.color.gray500,
  gray400: tokens.color.gray600,
  gray500: tokens.color.gray500,
  gray700: tokens.color.gray400,
  primary100: tokens.color.purple100,
  primary200: tokens.color.purple200,
  primary500: tokens.color.purple500,
  primary300: tokens.color.purple300,
  black: tokens.color.gray400,
  white: tokens.color.gray900,
  green: tokens.color.green500,
  red: tokens.color.red500,
});

const allThemes = {
  light: {
    ...defaultThemes.light,
    ...lightTheme,
  },
  dark: {
    ...defaultThemes.dark,
    ...darkTheme,
  },
};

type ThemeName = keyof typeof allThemes;

type Themes = {
  [key in ThemeName]: BaseTheme;
};

export const themes: Themes = allThemes;
