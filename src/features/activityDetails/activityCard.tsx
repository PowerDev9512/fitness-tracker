import { Card, Heading } from "components";
import dateFormat from "dateformat";
import { Image, Separator, Stack, Text, TextArea, useWindowDimensions } from "tamagui";
import { Activity, Workout } from "types";

interface Props {
  workout: WorkoutAndActivity;
  isMain: boolean;
}

type WorkoutAndActivity = { activity: Activity } & Omit<Workout, "activities">;

export const ActivityCard = ({ workout, isMain }: Props) => {
  const { activity } = workout;

  return (
    <Stack w="100%" key={`${activity.id} View`}>
      <Card key={`${activity.id} Card`} p="$4" mx="auto">
        <Heading mx="auto" key={`${activity.id} Title`}>
          {workout.name}
        </Heading>
        <Text mb="$2" mx="auto" key={`${activity.id} Time`}>
          {dateFormat(new Date(workout.time), "dddd, mmmm dS")}
        </Text>
        <Separator mb="$2" key={`${activity.id} Divider`} />

        {activity.type === "cardio" && (
          <Stack key={`${activity.id} Cardio View`}>
            <Text key={`${activity.id} Goal`}>
              <Text key={`${activity.id} Goal Bold`} fontWeight="bold">
                Goal{" "}
              </Text>
              {activity.targetDistance} in {activity.targetDuration}
            </Text>

            {activity.duration !== null && activity.distance !== null && (
              <Text key={`${activity.id} Actual Sets`}>
                <Text key={`${activity.id} Actual Sets Bold`} fontWeight="bold">
                  Result{" "}
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
                Goal{" "}
              </Text>
              {activity.targetSets} x {activity.targetReps} at{" "}
              {activity.targetWeight}
            </Text>

            {activity.sets && activity.reps && activity.weight && (
              <Text key={`${activity.id} Actual Sets`}>
                <Text key={`${activity.id} Actual Sets Bold`} fontWeight="bold">
                  Result{" "}
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
          mt="$2"
          w="100%"
          disabled
          key={`${activity.id} Notes`}
          value={activity.notes ?? "No notes"}
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
        <Text mt="$4" fontWeight="bold" mx="auto" key={`${activity.id} Other`}>
          {" "}
          Other {workout.activity.name} Workouts{" "}
        </Text>
      )}
    </Stack>
  );
};
