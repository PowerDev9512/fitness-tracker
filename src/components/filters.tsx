import React from "react";
import { XStack } from "tamagui";
import { titleCase } from "utils";

import { Select } from "./select";

type TFilters = Record<string, string | undefined>;

type FilterValue = string | undefined;

export interface FilterOption {
  name: keyof TFilters;
  placeholder: string;
  values: FilterValue[];
}

interface Props {
  filters: TFilters;
  setFilters: (filters: TFilters) => void;
  filterOptions: FilterOption[];
  width?: string;
}

export const Filters = ({
  filters,
  setFilters,
  filterOptions,
  width = undefined,
}: Props) => {
  const filterOptionsWithClear = filterOptions.map((option) => ({
    ...option,
    values: [undefined, ...option.values],
  }));

  const createSelect = (
    key: keyof TFilters,
    placeholder: string,
    options: FilterValue[]
  ) => (
    <Select
      key={`${key}-select`}
      w={`${98 / filterOptions.length}%`}
      mb={2}
      borderWidth={0}
      value={{
        label: titleCase(filters[key] ?? ""),
        value: filters[key] ?? "",
      }}
      placeholder={placeholder}
      data={options.map((option) => ({
        label: option ? titleCase(option) : "Clear",
        value: option,
      }))}
      onChangeValue={(itemValue) =>
        setFilters({ ...filters, [key]: itemValue })
      }
    />
  );

  return (
    <XStack space="$2" mr="auto" width={width}>
      {filterOptionsWithClear.map((option) =>
        createSelect(option.name, option.placeholder, option.values)
      )}
    </XStack>
  );
};
