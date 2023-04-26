import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React from "react";
import { Adapt, Text, Select as SelectBase, Sheet, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import { titleCase } from "../utils/formatting";

export type SelectData<T> = {
  label: string;
  value: T;
};

interface BaseProps<T> {
  data: SelectData<T>[];
  value: SelectData<T> | undefined;
  onChangeValue: (value: T) => void;
  placeholder: string;
  isDisabled?: boolean;
}

type Props<T> = BaseProps<T> & React.ComponentProps<typeof SelectBase.Trigger>;

const SelectInternal = <T extends unknown>({
  data,
  value,
  placeholder,
  onChangeValue,
  isDisabled = false,
  ...props
}: Props<T>) => {
  const handleOnChangeValue = (selectedValue: string) => {
    const matchingValue = data.find((item) => item.value === selectedValue);

    if (matchingValue) {
      onChangeValue(matchingValue?.value);
    }
  };

  return (
    <SelectBase
      id={placeholder}
      key={value?.label}
      value={value?.value}
      onValueChange={handleOnChangeValue}
    >
      <SelectBase.Trigger
        disabled={isDisabled || data.length === 0}
        w="100%"
        iconAfter={ChevronDown}
        backgroundColor="$white"
        {...props}
      >
        {value?.label !== undefined && (
          <Text fontSize={15} mr={1} textAlign="left">
            {titleCase(value?.label)}
          </Text>
        )}
        {value?.label === undefined ||
          (value?.label === "" && (
            <Text mr="auto" textAlign="left" fontSize={15}>
              {titleCase(placeholder)}
            </Text>
          ))}
      </SelectBase.Trigger>

      <Adapt>
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <SelectBase.Content zIndex={200000}>
        <SelectBase.ScrollUpButton
          ai="center"
          jc="center"
          pos="relative"
          w="100%"
          h="$3"
        >
          <YStack zi={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "$backgroundTransparent"]}
            br="$4"
          />
        </SelectBase.ScrollUpButton>

        <SelectBase.Viewport>
          <SelectBase.Group>
            <SelectBase.Label> {placeholder} </SelectBase.Label>
            {data.map((item, i) => {
              return (
                <SelectBase.Item
                  index={i}
                  key={item.label}
                  value={item.value as unknown as string}
                >
                  <SelectBase.ItemText>{item.label}</SelectBase.ItemText>
                  <SelectBase.ItemIndicator ml="auto">
                    <Check size={16} />
                  </SelectBase.ItemIndicator>
                </SelectBase.Item>
              );
            })}
          </SelectBase.Group>
        </SelectBase.Viewport>

        <SelectBase.ScrollDownButton
          ai="center"
          jc="center"
          pos="relative"
          w="100%"
          h="$3"
        >
          <YStack zi={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$backgroundTransparent", "$background"]}
            br="$4"
          />
        </SelectBase.ScrollDownButton>
      </SelectBase.Content>
    </SelectBase>
  );
};

export const Select = React.memo(SelectInternal) as typeof SelectInternal;
