import { Card, RadioButton } from "components";
import React from "react";
import { Text, XStack } from "tamagui";

import { SettingSection } from "../settingsSections";

interface Props {
  item: SettingSection;
  onChange: (value: string) => void;
  value: string;
}

export const UserSetting = ({ item, onChange, value }: Props) => {
  const key = (opt: { title: string; value: string }) =>
    `${item.key}-${opt.value}-${value}`;

  return (
    <Card w="100%" mx="auto" my="$2" p="$4">
      <Text ml="$1" mb="$2">
        {item.title}
      </Text>
      {item.options.map((option) => (
        <XStack
          ml={2}
          mb={1}
          key={`${key(option)}-stack`}
          alignItems="center"
          space="$2"
        >
          <RadioButton
            value={option.value}
            checked={value === option.value}
            onValueChange={onChange}
          />
          <Text key={`${key(option)}-text`}>{option.title}</Text>
        </XStack>
      ))}
    </Card>
  );
};
