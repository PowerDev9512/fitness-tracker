import {
  themes as defaultThemes,
  tokens as defaultTokens,
} from "@tamagui/theme-base";
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
    $gray100: "#f5f7f9",
    $gray200: "#e4e7eb",
    $gray300: "#cbd2d9",
    $gray400: "#9aa5b1",
    $gray500: "#7b8794",
    $gray600: "#616e7c",
    $gray700: "#52606d",
    $gray800: "#3e4c59",
    $gray900: "#323f4b",
  },
});

const lightTheme = createTheme({
  background: tokens.color.$gray100,
  backgroundStrong: tokens.color.$gray300,
  gray200: tokens.color.$gray200,
  gray400: tokens.color.$gray400,
  gray500: tokens.color.$gray500,
  gray700: tokens.color.$gray700,
  primary500: tokens.color.$blue500,
  primary300: tokens.color.$blue300,
});

type BaseTheme = typeof lightTheme;

const darkTheme: BaseTheme = createTheme({
  background: tokens.color.$gray900,
  backgroundStrong: tokens.color.$gray800,
  gray200: tokens.color.$gray600,
  gray400: tokens.color.$gray600,
  gray500: tokens.color.$gray500,
  gray700: tokens.color.$gray400,
  primary500: tokens.color.$purple500,
  primary300: tokens.color.$purple300,
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
