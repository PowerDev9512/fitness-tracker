import { useGetUser } from "api";
import { Button, Card, FormLabel, Heading } from "components";
import React, { useMemo } from "react";
import { Image, ScrollView, Stack, Text, XStack, YStack } from "tamagui";
import { CardioActivity, StrengthActivity } from "types";
import { getDistanceFormatter, getWeightFormatter } from "utils";

import { ActionButton } from "./actionButton";
import { IncrementBar } from "./incrementBar";
import { WorkoutDemonstrationModal } from "./workoutDemonstrationModal";
import { CreateWorkoutProps } from "../../createWorkout";

export const WorkoutDetails = ({ form }: CreateWorkoutProps) => {
  const { activity } = form.values;
  const { data: user } = useGetUser();
  const [isOpen, setIsOpen] = React.useState(false);

  const distanceFormatter = getDistanceFormatter(user);
  const weightFormatter = getWeightFormatter(user);

  const max = useMemo(
    () =>
      user?.maxes?.find(
        (curr) => curr.exercise === activity?.exercise?.name ?? ""
      ),
    [activity?.exercise.name, user?.maxes]
  );

  const activitySpecificFields = useMemo(() => {
    const handleActivityUpdate = (field: string) => (value: string) => {
      if (activity) {
        const stringAsNumber = parseInt(value, 10);
        form.setFieldValue("activity", {
          ...activity,
          [field]: stringAsNumber,
        });
      }
    };

    const createCardioFields = (cardioActivity: CardioActivity) => (
      <Stack mb={4}>
        <IncrementBar
          name={distanceFormatter("Distance")}
          increments={[5, 1, -1, -5]}
          value={cardioActivity.targetDistance}
          onChange={handleActivityUpdate("targetDistance")}
        />

        <IncrementBar
          name="Duration"
          increments={[5, 1, -1, -5]}
          value={cardioActivity.targetDuration}
          onChange={handleActivityUpdate("targetDuration")}
        />
      </Stack>
    );

    const createWeightFields = (strengthActivity: StrengthActivity) => (
      <Stack>
        <IncrementBar
          name="Sets"
          increments={[3, 1, -1, -3]}
          value={strengthActivity.targetSets}
          onChange={handleActivityUpdate("targetSets")}
        />
        <IncrementBar
          name="Reps"
          increments={[5, 1, -1, -5]}
          value={strengthActivity.targetReps}
          onChange={handleActivityUpdate("targetReps")}
        />
        <IncrementBar
          name={weightFormatter("Weight")}
          increments={[50, 10, -10, -50]}
          value={strengthActivity.targetWeight}
          onChange={handleActivityUpdate("targetWeight")}
          titleAccessory={
            <Button
              accessibilityLabel="Set as bodyweight"
              variant="link"
              mb="$2"
              onPress={() =>
                handleActivityUpdate("targetWeight")(
                  user?.weight?.toString() ?? "0"
                )
              }
            >
              Set as bodyweight
            </Button>
          }
        />
      </Stack>
    );

    if (activity) {
      switch (activity.type) {
        case "strength":
          return createWeightFields(activity);
        case "cardio":
          return createCardioFields(activity);
        default:
          return null;
      }
    }
    return null;
  }, [activity, distanceFormatter, form, user?.weight, weightFormatter]);

  const maxFields = useMemo(
    () => (
      <Stack p="$3" mt={4}>
        <Heading mt={2}>Training Maxes</Heading>
        {!max && (
          <Text>
            Not enough data is present to estimate your training maxes
          </Text>
        )}
        {max && (
          <>
            <Text mb={2}>
              {`We have estimated your one rep max to be ${weightFormatter(
                max.estimatedOneRepMax.toString()
              )}. You can set your weight to percentages of this max below:`}
            </Text>
            <XStack mt={2} justifyContent="space-between">
              <YStack alignItems="center">
                <Button
                  accessibilityLabel="Set weight to 100% of estimated one rep max"
                  onPress={() =>
                    form.setFieldValue("activity", {
                      ...activity,
                      targetWeight: max.estimatedOneRepMax,
                    })
                  }
                >
                  100%
                </Button>
                <Text>1 Rep</Text>
              </YStack>
              <YStack alignItems="center">
                <Button
                  accessibilityLabel="Set weight to 90% of estimated one rep max"
                  onPress={() =>
                    form.setFieldValue("activity", {
                      ...activity,
                      targetWeight: max.estimatedOneRepMax * 0.9,
                    })
                  }
                >
                  90%
                </Button>
                <Text>3 Reps</Text>
              </YStack>
              <YStack alignItems="center">
                <Button
                  accessibilityLabel="Set weight to 80% of estimated one rep max"
                  onPress={() =>
                    form.setFieldValue("activity", {
                      ...activity,
                      targetWeight: max.estimatedOneRepMax * 0.8,
                    })
                  }
                >
                  80%
                </Button>
                <Text>5 Reps</Text>
              </YStack>
              <YStack alignItems="center">
                <Button
                  accessibilityLabel="Set weight to 75% of estimated one rep max"
                  onPress={() =>
                    form.setFieldValue("activity", {
                      ...activity,
                      targetWeight: max.estimatedOneRepMax * 0.75,
                    })
                  }
                >
                  75%
                </Button>
                <Text>8-12 Reps</Text>
              </YStack>
            </XStack>
          </>
        )}
      </Stack>
    ),
    [activity, form, max, weightFormatter]
  );

  if (!user || !activity) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <WorkoutDemonstrationModal
        url={activity.exercise.gifUrl ?? ""}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <Card w="100%" mt={4}>
        <FormLabel pl="$3" pt="$2" mr="auto" fontWeight="bold" fontSize={32}>
          {activity.exercise.name}
        </FormLabel>
        {activitySpecificFields}
        {maxFields}
        <Stack>
          <Button
            accessibilityLabel="View demonstration"
            variant="link"
            mx="auto"
            mb="$3"
            w="75%"
            onPress={() => setIsOpen(true)}
          >
            View Demonstration
          </Button>
        </Stack>
      </Card>
    </>
  );
};
