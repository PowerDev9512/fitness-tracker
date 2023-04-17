import { FormInput, FormLabel, RadioButton } from "components";
import React from "react";
import { Stack, XStack } from "tamagui";

import { RegisterProps } from "../../register";

export const BuddyForm = ({ form }: RegisterProps) => {
  return (
    <Stack w="90%">
      <Stack mb="$4" mr="auto">
        <FormLabel>Measurement Unit</FormLabel>
        {["Metric", "Imperial"].map((unit) => (
          <XStack key={unit} alignItems="center">
            <RadioButton
              key={unit}
              checked={form.values.measurementUnit === unit.toLowerCase()}
              value={unit.toLowerCase()}
              onValueChange={(value) =>
                form.setFieldValue("measurementUnit", value)
              }
            />
            <FormLabel ml={2}>{unit}</FormLabel>
          </XStack>
        ))}
      </Stack>

      <Stack mb="$4" mr="auto">
        <FormLabel>Height</FormLabel>
        {["Kilograms", "Pounds"].map((unit) => (
          <XStack key={unit} alignItems="center">
            <RadioButton
              key={unit}
              value={unit.toLowerCase()}
              checked={form.values.weightUnit === unit.toLowerCase()}
              onValueChange={(value) => form.setFieldValue("weightUnit", value)}
            />
            <FormLabel ml={2}>{unit}</FormLabel>
          </XStack>
        ))}
      </Stack>
    </Stack>
  );
};
