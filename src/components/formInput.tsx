import React from "react";
import { Label, XStack, YStack } from "tamagui";

import { FormLabel } from "./formLabel";
import { Input } from "./input";

interface Props {
  required?: boolean;
  error?: string;
  helpText?: string;
  name: string;
  placeholder?: string | undefined;
  value: string | number | undefined;
  onBlur: (e: any) => void;
  onChangeText: (value: string) => void;
  hideLabel?: boolean;
  type?: "text" | "password";
}

export const FormInput = ({
  name,
  value,
  onChangeText,
  onBlur,
  hideLabel = false,
  placeholder = undefined,
  error = undefined,
  helpText = undefined,
  required = false,
  type = "text",
}: Props) => {
  return (
    <YStack w="100%">
      <XStack>
        {!hideLabel && <FormLabel>{name}</FormLabel>}
        {required && !hideLabel && <FormLabel variant="error"> *</FormLabel>}
      </XStack>

      <Input
        accessibilityLabel={`${name} input`}
        mb={2}
        w="100%"
        type={type}
        value={value}
        onBlur={onBlur}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />

      {helpText && <Label>{helpText}</Label>}
      {error && <FormLabel variant="error">{error}</FormLabel>}
    </YStack>
  );
};
