import React, {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
} from "react";
import { Animated, Dimensions } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BaseCarousel from "react-native-reanimated-carousel";
import { Stack } from "tamagui";

interface Props {
  items: any[];
  disable?: boolean | undefined;
  renderItem: (
    item: any,
    index: number,
    isFocused: boolean
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  defaultIndex?: number | undefined;
}

const maxDotsToShow = 5;

export const Carousel = ({
  renderItem,
  items,
  disable = false,
  defaultIndex = undefined,
}: Props) => {
  const { width } = Dimensions.get("window");

  const [index, setIndex] = React.useState(defaultIndex ?? 0);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const memoizedItems = React.useMemo(() => items, [items]);

  const startIndex =
    index <= maxDotsToShow / 2 ? 0 : index - Math.floor(maxDotsToShow / 2);

  const endIndex =
    startIndex + maxDotsToShow >= memoizedItems.length
      ? memoizedItems.length
      : startIndex + maxDotsToShow;

  const displayedItems = memoizedItems.slice(startIndex, endIndex);

  const inputRange = [startIndex, endIndex];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, displayedItems.length * width],
  });

  useEffect(() => {
    positionAnimatedValue.setValue(defaultIndex ?? 0);
  }, []);

  const onPageScroll = useCallback(
    (_offsetProgress: number, absoluteProgress: number) => {
      positionAnimatedValue.setValue(absoluteProgress);
      setIndex(Math.round(absoluteProgress));
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
        data={memoizedItems}
        onProgressChange={onPageScroll}
        defaultIndex={defaultIndex}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: 95,
        }}
        renderItem={({ item, index: currIndex }) =>
          renderItem(item, currIndex, index === currIndex)
        }
      />
      <Stack mx="auto" mt="$-10">
        <ExpandingDot
          data={displayedItems}
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
