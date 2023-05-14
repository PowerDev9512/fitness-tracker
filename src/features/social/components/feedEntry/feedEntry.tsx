import { useGetUser } from "api";
import { Avatar, Card, Heading, Skeleton } from "components";
import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
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
        return `${activity.exercise.name} | ${activity.sets} x ${
          activity.reps
        }, ${weightFormatter((activity.weight ?? 0).toString(), false)}`;
      case "cardio":
        return `${activity.exercise.name} | ${distanceFormatter(
          (activity.distance ?? 0).toString(),
          false
        )} in ${activity.duration} minutes`;
    }
  };

  if (!item?.user?.username) {
    return <Skeleton />;
  }

  return (
    <Pressable onPress={() => onPress(item.user)} style={{ width: "100%" }}>
      <Card pb="$3" mt="$3" w="100%" bg="white">
        <XStack>
          <Avatar
            p="$3"
            ml="$4"
            callback={() => null}
            user={item.user}
            size="md"
          />
          <Stack mt="$2">
            <XStack mt="$2" alignItems="center">
              <Heading fontSize={18}> {item.user.username} </Heading>
              <Text>• {formattedTimeSince} </Text>
            </XStack>

            <Stack ml="$1.5" mt="$1.5">
              {item.workout.activities.map((activity) => (
                <Text>{activityToText(activity)} </Text>
              ))}
            </Stack>
          </Stack>
        </XStack>
      </Card>
    </Pressable>
  );
};
