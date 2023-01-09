import { Delete } from "@tamagui/lucide-icons";
import { useGetUser } from "api";
import React from "react";
import { Button, Text, XStack } from "tamagui";
import { Activity } from "types";
import { getDistanceFormatter, getWeightFormatter } from "utils";

interface Props {
  activity: Activity;
  deleteActivity: () => void;
}

export function ActivityEntry({ activity, deleteActivity }: Props) {
  const { data: user } = useGetUser();

  const weightFormatter = getWeightFormatter(user);
  const distanceFormatter = getDistanceFormatter(user);

  const createChild = (currActivity: Activity) => {
    switch (currActivity.type) {
      case "strength":
        return (
          <Text key={`${currActivity.name}-text`} my={2}>
            <Text fontWeight="bold" key={`${currActivity.name}-text-title`}>
              {currActivity.name.trim()}
            </Text>
            {"\n"}
            {currActivity.targetSets}x{currActivity.targetReps},{" "}
            {weightFormatter(currActivity.targetWeight.toString(), false)}
          </Text>
        );
      case "cardio":
        return (
          <Text key={`${currActivity.name}-text`} my={2}>
            <Text fontWeight="bold" key={`${currActivity.name}-text-title`}>
              {currActivity.name}
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
    <XStack key={`${activity.name}-hstack`} alignItems="center">
      {createChild(activity)}
      <Button
        onPress={deleteActivity}
        key={`${activity.name}-delete-button`}
        ml="auto"
        icon={<Delete key={`${activity.name}-delete-icon`} color="$gray500" />}
      />
    </XStack>
  );
}
