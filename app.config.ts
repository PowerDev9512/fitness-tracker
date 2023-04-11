import { ConfigContext, ExpoConfig } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_BETA = process.env.APP_VARIANT === "beta";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  jsEngine: "hermes",
  updates: {
    url: "https://u.expo.dev/87b6b9bf-d4ba-40c3-83af-a358273cf05a",
  },
  name: IS_DEV ? `[DEV] ${config.name}` : config.name ?? "FitnessTracker",
  slug: config.slug ?? "FitnessTracker",
  icon: IS_DEV
    ? "./src/assets/icons/icon-dev.png"
    : IS_BETA
    ? "./src/assets/icons/icon-beta.png"
    : "./src/assets/icons/icon.png",
  android: {
    ...config.android,
    runtimeVersion: {
      policy: "nativeVersion",
    },
    package: "fitness.tracker",
  },
});
