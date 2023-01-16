import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React from "react";
import { Adapt, Select as SelectBase, Sheet, YStack } from "tamagui";

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

export const Select = <T extends unknown>({
  data,
  value,
  placeholder,
  onChangeValue,
  isDisabled = false,
  ...props
}: Props<T>) => {
  const handleOnChangeValue = (selectedValue: string) => {
    const matchingValue = data.find(
      (item) => item.label.toLowerCase() === selectedValue.toLowerCase()
    );

    if (matchingValue) {
      onChangeValue(matchingValue?.value);
    }
  };

  return (
    <SelectBase value={value?.label} onValueChange={handleOnChangeValue}>
      <SelectBase.Trigger
        disabled={isDisabled}
        w="100%"
        iconAfter={ChevronDown}
        {...props}
      >
        <SelectBase.Value placeholder />
      </SelectBase.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <SelectBase.Content zIndex={200_000}>
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
        </SelectBase.ScrollUpButton>

        <SelectBase.Viewport minWidth={200}>
          <SelectBase.Group>
            <SelectBase.Label> {placeholder} </SelectBase.Label>
            {data.map((item, i) => {
              return (
                <SelectBase.Item
                  index={i}
                  key={item.label}
                  value={item.label.toLowerCase()}
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
        </SelectBase.ScrollDownButton>
      </SelectBase.Content>
    </SelectBase>
  );
};
