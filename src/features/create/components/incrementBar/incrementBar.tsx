import { Button, FormLabel, Input } from "components";
import React, { useCallback, useMemo } from "react";
import { Stack, Text, XStack } from "tamagui";

interface Props {
  name: string;
  value: number;
  onChange: (newValue: string) => void;
  increments: number[];
  titleAccessory?: React.ReactNode;
}

const IncrementBarInternal = ({
  value,
  onChange,
  name,
  increments,
  titleAccessory,
}: Props) => {
  const createButton = useCallback(
    (increment: number, index: number) => {
      const incrementHandler = () => onChange((value + increment).toString());

      const isFirst = increment > 0 && index === 0;
      const leftBorderRadius = isFirst ? 10 : 0;

      const isLast = increment < 0 && index === increments.length / 2 - 1;
      const rightBorderRadius = isLast ? 10 : 0;

      return (
        <Button
          w="20%"
          key={`${increment}-${index}`}
          borderRadius={0}
          borderTopLeftRadius={leftBorderRadius}
          borderBottomLeftRadius={leftBorderRadius}
          borderTopRightRadius={rightBorderRadius}
          borderBottomRightRadius={rightBorderRadius}
          backgroundColor={increment > 0 ? "$primary500" : "red"}
          borderWidth={1}
          borderColor="white"
        >
          <Text
            key={`${increment}-${index}-text`}
            onPress={incrementHandler}
            w="100%"
            py={3}
            ml={10}
            color="white"
          >
            {increment > 0 ? `+${increment}` : increment}
          </Text>
        </Button>
      );
    },
    [increments.length, onChange, "primary", "white", "red", value]
  );

  const handleInputChange = (newValue: string) => {
    if (newValue === "") {
      onChange("0");
    } else {
      onChange(newValue);
    }
  };

  const positiveIncrements = useMemo(
    () => increments.filter((i) => i > 0).map(createButton),
    [createButton, increments]
  );
  const negativeIncrements = useMemo(
    () => increments.filter((i) => i < 0).map(createButton),
    [createButton, increments]
  );

  return (
    <Stack w="100%">
      <XStack mt="auto">
        <FormLabel pl="$3" mt="$2">
          {name}
        </FormLabel>
        {titleAccessory && (
          <Text fontSize={8} ml="auto">
            {titleAccessory}
          </Text>
        )}
      </XStack>
      <XStack mx="auto" alignContent="center">
        {positiveIncrements}
        <Input
          value={value.toString()}
          onChangeText={handleInputChange}
          placeholder="0"
          borderColor="white"
          type="text"
          borderRadius={0}
          backgroundColor="white"
          w="15%"
          textAlign="center"
        />
        {negativeIncrements}
      </XStack>
    </Stack>
  );
};

export const IncrementBar = React.memo(IncrementBarInternal);
