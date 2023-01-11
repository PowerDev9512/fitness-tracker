import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView } from "react-native";
import { Input as BaseInput, Stack, Text } from "tamagui";

import { Input } from "./input";

interface BaseProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  value: string;
  onChange: (value: string) => void;
}

type Props<T> = BaseProps<T> &
  Omit<React.ComponentProps<typeof BaseInput>, keyof BaseProps<T>>;

export const Autocomplete = <T extends unknown>(props: Props<T>) => {
  const { data, value, onChange, keyExtractor } = props;
  const [showList, setShowList] = useState(false);

  const textProps = useMemo(() => {
    const { data: _, value: __, onChange: ___, ...rest } = props;
    return rest;
  }, [props]);

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          keyExtractor(item).toLowerCase().includes(value.toLowerCase()) &&
          keyExtractor(item).toLowerCase() !== value.toLowerCase()
      ),
    [data, value, keyExtractor]
  );

  const limitedData = useMemo(
    () =>
      filteredData.length > 5
        ? filteredData.slice(0, 5)
        : filteredData.slice(0, filteredData.length),
    [filteredData]
  );

  return (
    <Stack {...textProps}>
      <Stack>
        <Input
          {...textProps}
          placeholder={textProps?.placeholder ?? "Search"}
          accessibilityLabel={`${value} input`}
          type="text"
          placeholderTextColor="$gray400"
          onFocus={() => setShowList(true)}
          onBlur={() => setShowList(false)}
          value={value}
          onChangeText={(e: string) => onChange(e)}
        />
      </Stack>

      {showList && filteredData.length > 0 && (
        <SafeAreaView>
          <FlatList
            keyExtractor={keyExtractor}
            data={limitedData}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            renderItem={({ item }) => {
              const key = keyExtractor(item);
              return (
                <Pressable
                  style={{ marginLeft: 2 }}
                  onTouchStart={() => onChange(key)}
                >
                  <Text fontSize={14} fontWeight="bold" color="$gray400">
                    {key}
                  </Text>
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      )}
    </Stack>
  );
};
