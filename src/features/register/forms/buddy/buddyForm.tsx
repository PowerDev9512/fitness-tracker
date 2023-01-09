import { FormInput, FormLabel, RadioButton } from "components";
import React from "react";
import { HStack, View } from "tamagui";

import { RegisterProps } from "../../register";
import * as SC from "../../register.styles";

export function BuddyForm({ form }: RegisterProps) {
  return (
    <SC.Container>
      <FormInput
        onChangeText={form.handleChange("buddyName")}
        onBlur={form.handleBlur("buddyName")}
        value={form.values.buddyName}
        required
        error={
          form.errors.buddyName && form.touched.buddyName
            ? form.errors.buddyName
            : undefined
        }
        name="Buddy Name"
      />

      <Stack mb={2} mr="auto">
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

      <Stack mr="auto">
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
    </SC.Container>
  );
}