import React from "react";
import { XStack } from "tamagui";
import { titleCase } from "utils";

import { Select } from "./select";

type TFilters = Record<string, string | undefined>;

export interface FilterOption {
  name: keyof TFilters;
  placeholder: string;
  values: string[];
}

interface Props {
  filters: TFilters;
  setFilters: (filters: TFilters) => void;
  filterOptions: FilterOption[];
}

export const Filters = ({ filters, setFilters, filterOptions }: Props) => {
  const createSelect = (
    key: keyof TFilters,
    placeholder: string,
    options: string[]
  ) => (
    <Select
      key={`${key}-select`}
      w="33.25%"
      mb={2}
      borderWidth={0}
      value={{
        label: titleCase(filters[key] ?? ""),
        value: filters[key] ?? "",
      }}
      placeholder={placeholder}
      data={options.map((option) => ({
        label: titleCase(option),
        value: option,
      }))}
      onChangeValue={(itemValue) =>
        setFilters({ ...filters, [key]: itemValue })
      }
    />
  );

  return (
    <XStack mx="auto">
      {filterOptions.map((option) =>
        createSelect(option.name, option.placeholder, option.values)
      )}
    </XStack>
  );
};
