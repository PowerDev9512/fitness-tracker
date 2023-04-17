import { useGetUser } from "api";
import { Avatar, Card, Heading, Skeleton } from "components";
import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { Activity, Message, User } from "types";

import {
  createDistanceFormatter,
  createWeightFormatter,
} from "../../../../utils/formatting";

interface Props {
  message: Message;
  onPress: (user: User) => void;
}

export const FeedEntry = ({ message: item, onPress }: Props) => {
  const { data: user } = useGetUser();
  const timeSinceMessage = Math.abs(
    (new Date().getTime() - new Date(item.date).getTime()) / 1000
  );

  const weightFormatter = createWeightFormatter(
    user?.userSettings?.weightUnit ?? "kilograms"
  );

  const distanceFormatter = createDistanceFormatter(
    user?.userSettings?.measurementUnit ?? "metric"
  );

  const formattedTimeSince = useMemo(() => {
    if (timeSinceMessage < 60) {
      return `${timeSinceMessage} seconds ago`;
    } else if (timeSinceMessage < 3600) {
      return `${Math.floor(timeSinceMessage / 60)} minutes ago`;
    } else if (timeSinceMessage < 86400) {
      return `${Math.floor(timeSinceMessage / 3600)} hours ago`;
    } else {
      return `${Math.floor(timeSinceMessage / 86400)} days ago`;
    }
  }, [timeSinceMessage]);

  const activityToText = (activity: Activity) => {
    switch (activity.type) {
      case "strength":
        return `- ${activity.exercise.name} | ${activity.sets} x ${
          activity.reps
        }, ${weightFormatter((activity.weight ?? 0).toString(), false)}`;
      case "cardio":
        return `- ${activity.exercise.name} | ${distanceFormatter(
          (activity.distance ?? 0).toString(),
          false
        )} in ${activity.duration} minutes`;
    }
  };

  if (!item?.user?.username) {
    return <Skeleton />;
  }

  return (
    <Pressable onPress={() => onPress(item.user)}>
      <Card w="100%" mx="auto" bg="$primary300">
        <Card pb="$3" mt="$-2" w="100%" bg="white">
          <XStack>
            <Avatar p="$3" callback={() => null} user={item.user} size="md" />
            <YStack>
              <Heading mt="$3"> {item.user.username} </Heading>
              <Text mt="$-1"> {formattedTimeSince} </Text>
            </YStack>
          </XStack>

          <Text ml="$5">
            {" "}
            {item.user.username} has completed{" "}
            {`${item.workout.activities.length} ${
              item.workout.activities.length === 1 ? "exercise" : "exercises"
            }`}{" "}
          </Text>
          {item.workout.activities.map((activity) => (
            <Text ml="$7"> {activityToText(activity)} </Text>
          ))}
        </Card>
        <Text textAlign="right" p="$1.5">
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </Card>
    </Pressable>
  );
};
