import { Card, FormLabel } from "components";
import React from "react";
import { Calendar } from "react-native-calendars";

import { ActivitySummary } from "./activitySummary";
import { CreateWorkoutProps } from "../../createWorkout";
import { useTheme } from "tamagui";

type BaseProps = {
  onEditActivity: (index: number) => void;
};

type Props = CreateWorkoutProps & BaseProps;

export const ActivityDetails = ({ form, onEditActivity }: Props) => {
  const theme = useTheme();
  const { dates, workout } = form.values;

  return (
    <>
      <FormLabel mr="auto" ml="$1">
        Summary
      </FormLabel>
      <ActivitySummary
        workout={workout}
        onEditActivity={onEditActivity}
        onDeleteActivity={form.setFieldValue}
      />

      <FormLabel mb="$-2" mr="auto" ml="$1">
        Workout dates
      </FormLabel>
      <Card mb="$2">
        <Calendar
          onDayPress={(day) => {
            if (dates.includes(day.dateString)) {
              form.setFieldValue(
                "dates",
                dates.filter(date => date !== day.dateString)
              );
            } else {
              form.setFieldValue("dates", [...dates, day.dateString]);
            }
          }}
          markedDates={form.values.dates.reduce(
            (acc, date) => ({
              ...acc,
              [date]: { selected: true, selectedColor: theme.primary500.val },
            }),
            {}
          )}
        />
      </Card>
    </>
  );
};
