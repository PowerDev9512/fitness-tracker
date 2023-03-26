import { useNavigation } from "@react-navigation/native";
import { Button } from "components";
import React from "react";
import { XStack } from "tamagui";

interface Props {
  currentIndex: number;
  disabled: boolean;
  setIndex: (index: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export const NavigationButton = ({
  disabled,
  currentIndex,
  setIndex,
  onSubmit,
  loading = false,
}: Props) => {
  const navigation = useNavigation();

  const onClickNext = () => {
    setIndex(currentIndex + 1);
  };

  const onClickPrevious = () => {
    setIndex(currentIndex - 1);
  };

  return (
    <>
      {currentIndex === 0 && (
        <XStack space={2}>
          <Button style={{ width: "44%" }} onPress={() => navigation.goBack()}>
            Cancel
          </Button>
          <Button style={{ width: "44%" }} onPress={onClickNext}>
            Next
          </Button>
        </XStack>
      )}

      {currentIndex === 1 && (
        <XStack space={2}>
          <Button style={{ width: "44%" }} onPress={onClickPrevious}>
            Back
          </Button>
          <Button style={{ width: "44%" }} onPress={onClickNext}>
            Next
          </Button>
        </XStack>
      )}

      {currentIndex === 2 && (
        <XStack space={2}>
          <Button style={{ width: "44%" }} onPress={onClickPrevious}>
            Back
          </Button>
          <Button
            style={{ width: "44%" }}
            disabled={disabled}
            onPress={onSubmit}
          >
            Submit
          </Button>
        </XStack>
      )}
    </>
  );
};
