import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable } from "react-native";
import { Stack, Text, XStack } from "tamagui";

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <Stack
      flex={1}
      flexDirection="row"
      position="absolute"
      bottom={0}
      left={0}
      right={0}
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
          <Pressable
            key={`tab-${route.key}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            android_ripple={{ color: "rgba(0, 0, 0, .32)" }}
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
          </Pressable>
        );
      })}
    </Stack>
  );
}
