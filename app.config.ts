import { ConfigContext, ExpoConfig } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_BETA = process.env.APP_VARIANT === "beta";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  jsEngine: "hermes",
  name: IS_DEV ? `[DEV] ${config.name}` : config.name ?? "FitnessTracker",
  slug: config.slug ?? "FitnessTracker",
  icon: IS_DEV
    ? "./src/assets/icons/icon-dev.png"
    : IS_BETA
    ? "./src/assets/icons/icon-beta.png"
    : "./src/assets/icons/icon.png",
  android: {
    ...config.android,
    runtimeVersion: "1.0.0",
    package: IS_DEV ? "dev.tamagui.expo.devclient" : "dev.tamagui.expo.client",
  },
  ios: {
    ...config.ios,
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
});
