import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Animated, Dimensions } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { Stack } from "tamagui";

import { HomePageOne } from "./homePageOne";
import { HomePageThree } from "./homePageThree";
import { HomePageTwo } from "./homePageTwo";

const pages = [HomePageOne, HomePageTwo, HomePageThree];
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const Home = ({
  navigation,
}: NativeStackScreenProps<MainStackParams, "Home">) => {
  const width = Dimensions.get("window").width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, pages.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, pages.length * width],
  });

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Stack flex={1}>
      <AnimatedPagerView
        initialPage={0}
        ref={ref}
        style={{ flex: 1 }}
        onPageScroll={onPageScroll}
      >
        <HomePageOne key={1} onNext={() => ref.current?.setPage(1)} />
        <HomePageTwo key={2} onNext={() => ref.current?.setPage(2)} />
        <HomePageThree key={3} />
      </AnimatedPagerView>
      <Stack w="100%" h="10%">
        <Stack justifyContent="center">
          <ExpandingDot
            data={pages}
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
              top: 30,
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
