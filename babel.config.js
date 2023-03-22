// process.env.TAMAGUI_TARGET = "native";

module.exports = function (api) {
  api.cache(true);
  const moduleResolverOptions = {
    alias: {
      components: "./src/components",
      store: "./src/store",
      types: "./src/types",
      api: "./src/api",
      utils: "./src/utils",
      features: "./src/features",
    },
  };
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      ["module-resolver", moduleResolverOptions],
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./src/tamagui.config.ts",
          logTimings: true,
        },
      ],
      [
        "transform-inline-environment-variables",
        {
          include: "TAMAGUI_TARGET",
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
