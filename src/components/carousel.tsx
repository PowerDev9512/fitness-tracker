import React, { JSXElementConstructor, ReactElement, useState } from "react";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaginationDot from "react-native-insta-pagination-dots";
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
  const theme = useTheme();
  const [currentPage, setCurrentPage] = React.useState(defaultIndex);

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
        defaultIndex={defaultIndex}
        onScrollEnd={(index) => setCurrentPage(index)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.84,
          parallaxScrollingOffset: 100,
        }}
        renderItem={({ item, index }) => renderItem(item, index)}
      />
      <Stack mx="auto" mt="$-10">
        <PaginationDot
          activeDotColor={theme.primary300.val}
          curPage={currentPage}
          maxPage={items.length}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};
