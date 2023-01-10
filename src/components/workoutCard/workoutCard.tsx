import { Check, Cross, Trash } from "@tamagui/lucide-icons";
import { useDeleteWorkout, useGetUser } from "api";
import dateFormat from "dateformat";
import React, { useMemo, useState } from "react";
import {
  Card,
  Heading,
  ScrollView,
  Separator,
  Stack,
  Text,
  YStack,
} from "tamagui";
import { Activity, Workout } from "types";
import { titleCase } from "utils";

import { Badge } from "../badge";
import { CardioRow } from "./components/cardioRow";
import { StrengthRow } from "./components/strengthRow";

interface Props {
  workout: Workout;
  footer: React.ReactNode | null;
}

export function WorkoutCard({ workout, footer }: Props) {
  const [deleting, setDeleting] = useState(false);

  const { data: user } = useGetUser();
  const { mutate: deleteWorkout } = useDeleteWorkout();

  const createContent = (activity: Activity, children: React.ReactNode) => {
    const muscles = Object.keys(activity.muscleGroupStats).map((muscleGroup) =>
      titleCase(muscleGroup)
    );
    return (
      <Stack key={activity.id}>
        <Text mt={2} textAlign="left" fontSize={18} fontWeight="bold">
          {" "}
          {activity.name} | {muscles}{" "}
        </Text>
        {children}
      </Stack>
    );
  };

  const badges = useMemo(
    () =>
      (workout.past || workout.completed) && (
        <>
          {workout.completed && (
            <Badge side="right" background={false}>
              <Check size={25} color="$green500" />
            </Badge>
          )}

          {!workout.completed && (
            <Badge side="right" background={false}>
              <Cross size={25} color="$red500" />
            </Badge>
          )}
        </>
      ),
    [workout]
  );

  const footerContent = useMemo(
    () =>
      footer && (
        <>
          <Separator marginTop={4} marginBottom={3} bg="$gray200" />
          {footer}
        </>
      ),
    [footer]
  );

  const mainContent = useMemo(
    () => (
      <ScrollView>
        <YStack space={2}>
          {workout.activities.map((activity) => {
            switch (activity.type) {
              case "strength":
                return createContent(
                  activity,
                  <StrengthRow
                    key={activity.id}
                    activity={activity}
                    workout={workout}
                  />
                );
              case "cardio":
                return createContent(
                  activity,
                  <CardioRow
                    key={activity.id}
                    activity={activity}
                    workout={workout}
                  />
                );
              default:
                return null;
            }
          })}
        </YStack>
      </ScrollView>
    ),
    [workout]
  );

  return (
    <Stack>
      <YStack height="85%">
        <Badge
          side="left"
          loading={deleting}
          onClick={() => {
            setDeleting(true);
            deleteWorkout({ userId: user?.id ?? -1, workoutId: workout.id });
          }}
        >
          <Trash size={25} color="$red500" />
        </Badge>

        {badges}

        <Card accessibilityLabel="workout-card" height="90%" width={350}>
          <Heading justifyContent="center" textAlign="center" marginTop="1">
            {workout.name}
          </Heading>
          <Text justifyContent="center" textAlign="center" marginBottom="1">
            {dateFormat(new Date(workout.time), "dddd, mmmm dS")}
          </Text>
          <Separator mt="4" mb="6" />

          {mainContent}

          {footerContent}
        </Card>
      </YStack>
    </Stack>
  );
}
