import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView } from "react-native";
import { Input as BaseInput, Stack, Text } from "tamagui";

import { Input } from "./input";

interface Props<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  value: string;
  onChange: (value: string) => void;
  inputProps?: React.ComponentProps<typeof BaseInput>;
  viewProps?: React.ComponentProps<typeof Stack>;
}

export const Autocomplete = <T extends unknown>({
  data,
  keyExtractor,
  value,
  onChange,
  inputProps,
  viewProps,
}: Props<T>) => {
  const [showList, setShowList] = useState(false);

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
    <Stack {...viewProps}>
      <Stack>
        <Input
          placeholder={inputProps?.placeholder ?? "Search"}
          accessibilityLabel={`${value} input`}
          type="text"
          placeholderTextColor="$gray400"
          onFocus={() => setShowList(true)}
          onBlur={() => setShowList(false)}
          value={value}
          onChangeText={(e: string) => onChange(e)}
          {...inputProps}
        />
      </Stack>

      {showList && filteredData.length > 0 && (
        <SafeAreaView>
          <FlatList
            style={{ maxHeight: filteredData.length * 30 }}
            keyExtractor={keyExtractor}
            data={limitedData}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            renderItem={({ item }) => {
              const key = keyExtractor(item);
              return (
                <Pressable
                  style={{ marginLeft: 15 }}
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
