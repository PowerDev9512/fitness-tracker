import { useGetUser } from "api";
import { IconButton } from "components";
import React from "react";
import { Text, XStack } from "tamagui";
import { Activity } from "types";
import { getDistanceFormatter, getWeightFormatter } from "utils";

interface Props {
  activity: Activity;
  deleteActivity: () => void;
}

export const ActivityEntry = ({ activity, deleteActivity }: Props) => {
  const { data: user } = useGetUser();

  const weightFormatter = getWeightFormatter(user);
  const distanceFormatter = getDistanceFormatter(user);

  const createChild = (currActivity: Activity) => {
    switch (currActivity.type) {
      case "strength":
        return (
          <Text key={`${currActivity.exercise.name}-text`} my={2}>
            <Text
              fontWeight="bold"
              key={`${currActivity.exercise.name}-text-title`}
            >
              {currActivity.exercise.name.trim()}
            </Text>
            {"\n"}
            {currActivity.targetSets}x{currActivity.targetReps},{" "}
            {weightFormatter(currActivity.targetWeight.toString(), false)}
          </Text>
        );
      case "cardio":
        return (
          <Text key={`${currActivity.exercise.name}-text`} my={2}>
            <Text
              fontWeight="bold"
              key={`${currActivity.exercise.name}-text-title`}
            >
              {currActivity.exercise.name}
            </Text>
            {"\n"}
            {distanceFormatter(
              currActivity.targetDistance.toString(),
              false
            )}{" "}
            in {currActivity.targetDuration} minutes
          </Text>
        );
      default:
        return <Text key="no-activties-text"> Unsupported exercise type </Text>;
    }
  };

  return (
    <XStack p="$1" key={`${activity.exercise.name}-hstack`} alignItems="center">
      {createChild(activity)}
      <IconButton
        onPress={deleteActivity}
        key={`${activity.exercise.name}-delete-button`}
        ml="auto"
        mt="auto"
        size={24}
        color="$gray500"
        icon="ios-trash-bin"
      />
    </XStack>
  );
};
