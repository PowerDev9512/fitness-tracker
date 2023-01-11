import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconButton } from "components";
import React from "react";
import { Stack, Text, XStack } from "tamagui";

export const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <Stack
      pos="absolute"
      bottom={0}
      backgroundColor="white"
      left={0}
      right={0}
      p="$2"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      flex={1}
      flexDirection="row"
      overflow="hidden"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const title = options.title ?? route.name;
        const icon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true } as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <IconButton
            key={`tab-${route.key}`}
            mx="auto"
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <XStack space={4} justifyContent="center" alignItems="center">
              {icon?.({
                focused: isFocused,
                size: 20,
                color: isFocused ? "$primary500" : "$gray500",
              })}
              <Text
                textAlign="center"
                color={isFocused ? "$primary500" : "$gray500"}
              >
                {title}
              </Text>
            </XStack>
          </IconButton>
        );
      })}
    </Stack>
  );
};
