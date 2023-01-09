import { Button } from "components";
import React, { useCallback } from "react";
import { Stack, XStack } from "tamagui";

interface Props {
  currentIndex: number;
  disabled: boolean;
  setIndex: (index: number) => void;
  onSubmit: () => void;
  onAddActivity: () => void;
  loading?: boolean;
}

export const NavigationButtons = ({
  disabled,
  currentIndex,
  setIndex,
  onSubmit,
  onAddActivity,
  loading = false,
}: Props) => {
  const onClickNext = useCallback(() => {
    setIndex(currentIndex + 1);
  }, [currentIndex, setIndex]);

  const onClickPrevious = useCallback(() => {
    setIndex(currentIndex - 1);
  }, [currentIndex, setIndex]);

  const onCancel = useCallback(() => {
    setIndex(0);
  }, [setIndex]);

  return (
    <Stack mt={5} mb={2}>
      {currentIndex === 0 && (
        <XStack justifyContent="center" space={2}>
          <Button onPress={onClickNext}>Add New Activity</Button>
          <Button onPress={onSubmit} isDisabled={disabled} isLoading={loading}>
            Submit
          </Button>
        </XStack>
      )}

      {currentIndex === 1 && <Button onPress={onClickPrevious}>Back</Button>}

      {currentIndex === 2 && (
        <XStack space={2} justifyContent="center">
          <Button onPress={onCancel}>Cancel</Button>
          <Button onPress={onAddActivity}>Add Activity</Button>
        </XStack>
      )}
    </Stack>
  );
};
