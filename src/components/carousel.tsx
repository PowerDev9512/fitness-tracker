import React, { JSXElementConstructor, ReactElement, useState } from "react";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BaseCarousel from "react-native-reanimated-carousel";

interface Props {
  items: any[];
  renderItem: (
    item: any,
    index: number
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  defaultIndex?: number | undefined;
}

export const Carousel = ({
  renderItem,
  items,
  defaultIndex = undefined,
}: Props) => {
  const { width, height } = Dimensions.get("window");

  return (
    <GestureHandlerRootView style={{ marginTop: -20 }}>
      <BaseCarousel
        loop={false}
        vertical
        pagingEnabled
        width={width}
        height={height * 0.95}
        scrollAnimationDuration={1000}
        data={items}
        defaultIndex={defaultIndex}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 380,
        }}
        renderItem={({ item, index }) => renderItem(item, index)}
      />
    </GestureHandlerRootView>
  );
};
