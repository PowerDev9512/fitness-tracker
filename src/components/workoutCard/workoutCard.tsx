import { useDeleteWorkout, useGetUser } from "api";
import dateFormat from "dateformat";
import React, { useMemo, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView, Separator, Stack, Text, useTheme, YStack } from "tamagui";
import { Activity, Workout } from "types";
import { titleCase } from "utils";

import { Badge } from "../badge";
import { Card } from "../card";
import { Heading } from "../heading";
import { CardioRow } from "./components/cardioRow";
import { StrengthRow } from "./components/strengthRow";

interface Props {
  workout: Workout;
  footer: React.ReactNode | null;
}

export const WorkoutCard = ({ workout, footer }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();

  const { data: user } = useGetUser();
  const { mutate: deleteWorkout } = useDeleteWorkout();

  const createContent = (activity: Activity, children: React.ReactNode) => {
    const muscles = Object.keys(activity.muscleGroupStats).map((muscleGroup) =>
      titleCase(muscleGroup)
    );

    return (
      <Stack mb="$2" key={activity.id}>
        <Text mt={2} textAlign="left" fontSize={18} fontWeight="bold">
          {activity.name}{" "}
        </Text>
        <Text mb="$1.5" fontSize={14} color="$gray10Dark">
          {muscles.map((muscle) => muscle).join(", ")}
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
              <Icon
                name="ios-checkmark-sharp"
                size={30}
                color={theme.green.val}
              />
            </Badge>
          )}

          {!workout.completed && (
            <Badge side="right" background={false}>
              <Icon name="ios-close-sharp" size={30} color={theme.red.val} />
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
          <Separator mt="auto" mb="$4" bg="$gray200" />
          {footer}
        </>
      ),
    [footer]
  );

  const mainContent = useMemo(
    () => (
      <ScrollView>
        <Stack>
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
        </Stack>
      </ScrollView>
    ),
    [workout]
  );

  return (
    <Stack h="100%">
      <YStack h="100%">
        <Badge
          side="left"
          loading={deleting}
          onClick={() => {
            setDeleting(true);
            deleteWorkout({ userId: user?.id ?? -1, workoutId: workout.id });
          }}
        >
          <Icon name="trash-bin-sharp" size={25} color={theme.red.val} />
        </Badge>

        {badges}

        <Card p="$4" accessibilityLabel="workout-card" w={350} minHeight={400}>
          <Heading textAlign="center" justifyContent="center" mt="$1">
            {workout.name}
          </Heading>
          <Text justifyContent="center" textAlign="center" mb="$1">
            {dateFormat(new Date(workout.time), "dddd, mmmm dS")}
          </Text>
          <Separator mt="$4" mb="$3" />

          {mainContent}

          {footerContent}
        </Card>
      </YStack>
    </Stack>
  );
};
