import React, { JSXElementConstructor, ReactElement, useCallback, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BaseCarousel from "react-native-reanimated-carousel";
import { Stack, useTheme } from "tamagui";

interface Props {
  items: any[];
  disable?: boolean | undefined;
  renderItem: (
    item: any,
    index: number
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  defaultIndex?: number | undefined;
}

export const Carousel = ({
  renderItem,
  items,
  disable = false,
  defaultIndex = undefined,
}: Props) => {
  const { width } = Dimensions.get("window");

  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const inputRange = [0, items.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, items.length * width],
  });

  useEffect(() => {
    positionAnimatedValue.setValue(defaultIndex ?? 0);
  }, []);

  const onPageScroll = useCallback(
    (_offsetProgress: number, absoluteProgress: number) => {
      positionAnimatedValue.setValue(absoluteProgress);
    },
    [positionAnimatedValue]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, marginBottom: 50 }}>
      <BaseCarousel
        loop={false}
        vertical={false}
        pagingEnabled
        enabled={!disable}
        width={width}
        scrollAnimationDuration={500}
        data={items}
        onProgressChange={onPageScroll}
        defaultIndex={defaultIndex}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.84,
          parallaxScrollingOffset: 100,
        }}
        renderItem={({ item, index }) => renderItem(item, index)}
      />
      <Stack mx="auto" mt="$-10">
        <ExpandingDot
          data={items}
          expandingDotWidth={30}
          //@ts-ignore
          scrollX={scrollX}
          inActiveDotOpacity={0.6}
          dotStyle={{
            width: 10,
            height: 10,
            backgroundColor: "#347af0",
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          containerStyle={{
            top: -3,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};
