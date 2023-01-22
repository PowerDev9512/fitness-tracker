import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import { Card, Heading } from "components";
import dateFormat from "dateformat";
import React, { useEffect } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import { Image, Separator, Stack, Text, TextArea } from "tamagui";

import { Screen } from "../../components/screen";
import { Activity, Workout } from "../../types/domain";

interface Props {
  route: {
    params: {
      mainActivityId: number;
    };
  };
}

type WorkoutAndActivity = { activity: Activity } & Omit<Workout, "activities">;

export const ActivityDetails = ({ route }: Props) => {
  const { data: user } = useGetUser();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const activities =
    user?.workouts
      .map((workout) =>
        workout.activities.map((activity) => ({ ...workout, activity }))
      )
      .flat() ?? [];

  const mainActivity = activities.find(
    (a) => a.activity.id === route.params.mainActivityId
  );

  useEffect(() => {
    if (mainActivity !== undefined) {
      navigation.setOptions({
        title: mainActivity.activity.name,
      });
    }
  }, [mainActivity, navigation]);

  if (mainActivity === undefined) {
    return <Text>Activity not found</Text>;
  }

  const filteredActivities = activities
    .filter(
      (a) =>
        a.activity.exerciseId === mainActivity?.activity.exerciseId &&
        a.id !== mainActivity.id
    )
    .sort((a, b) => b.time.localeCompare(a.time));

  const createActivityCard = (
    workout: WorkoutAndActivity,
    isMain: boolean = false
  ) => {
    const { activity } = workout;

    return (
      <Stack w={width} key={`${activity.id} View`}>
        <Card key={`${activity.id} Card`} my={4} mx="auto" w="90%">
          <Heading mx="auto" key={`${activity.id} Title`}>
            {workout.name}
          </Heading>
          <Text mx="auto" key={`${activity.id} Time`}>
            {dateFormat(new Date(workout.time), "dddd, mmmm dS")}
          </Text>
          <Separator my={4} key={`${activity.id} Divider`} />

          {activity.type === "cardio" && (
            <Stack key={`${activity.id} Cardio View`}>
              <Text key={`${activity.id} Goal`}>
                <Text key={`${activity.id} Goal Bold`} fontWeight="bold">
                  Goal
                </Text>
                {activity.targetDistance} in {activity.targetDuration}
              </Text>

              {activity.duration !== null && activity.distance !== null && (
                <Text key={`${activity.id} Actual Sets`}>
                  <Text
                    key={`${activity.id} Actual Sets Bold`}
                    fontWeight="bold"
                  >
                    Result
                  </Text>
                  {activity.distance} in {activity.duration}
                </Text>
              )}

              {!activity.duration ||
                (!activity.distance && (
                  <Text key={`${activity.id} Uncompleted`}>
                    <Text
                      key={`${activity.id} Uncompleted Bold`}
                      fontWeight="bold"
                    >
                      Result
                    </Text>
                    Not completed
                  </Text>
                ))}
            </Stack>
          )}

          {activity.type === "strength" && (
            <Stack key={`${activity.id} Strength View`}>
              <Text key={`${activity.id} Sets`}>
                <Text key={`${activity.id} Sets Bold`} fontWeight="bold">
                  Goal
                </Text>
                {activity.targetSets} x {activity.targetReps} at{" "}
                {activity.targetWeight}
              </Text>

              {activity.sets && activity.reps && activity.weight && (
                <Text key={`${activity.id} Actual Sets`}>
                  <Text
                    key={`${activity.id} Actual Sets Bold`}
                    fontWeight="bold"
                  >
                    Result
                  </Text>
                  {activity.sets} x {activity.reps} at {activity.weight}
                </Text>
              )}

              {!activity.sets ||
                !activity.reps ||
                (!activity.weight && (
                  <Text key={`${activity.id} Uncompleted`}>
                    <Text
                      key={`${activity.id} Uncompleted Bold`}
                      fontWeight="bold"
                    >
                      Result
                    </Text>
                    Not completed
                  </Text>
                ))}
            </Stack>
          )}

          <TextArea
            mx="auto"
            my={4}
            key={`${activity.id} Notes`}
            value={activity.notes ?? "None"}
          />

          {activity.image && (
            <Image
              key={`${activity.id} Image`}
              accessibilityLabel={`${workout.name} image`}
              mx="auto"
              borderWidth={1}
              borderColor="$gray300"
              width={500}
              height={200}
              src={{
                uri: `data:image/${activity.image.fileExtension};base64,${activity.image.bytes}`,
              }}
            />
          )}
        </Card>
        {isMain && (
          <Text fontWeight="bold" mx="auto" key={`${activity.id} Other`}>
            {" "}
            Other {workout.activity.name} Workouts{" "}
          </Text>
        )}
      </Stack>
    );
  };

  return (
    <Screen>
      <FlatList
        data={filteredActivities}
        ListHeaderComponent={createActivityCard(mainActivity, true)}
        renderItem={({ item }) => createActivityCard(item)}
      />
    </Screen>
  );
};
