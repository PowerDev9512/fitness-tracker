import { Card, DatePicker, FormLabel } from "components";
import React from "react";
import { Slider } from "tamagui";

import { ActivitySummary } from "./activitySummary";
import { CreateWorkoutProps } from "../../createWorkout";

type BaseProps = {
  onEditActivity: (index: number) => void;
};

type Props = CreateWorkoutProps & BaseProps;

export const ActivityDetails = ({ form, onEditActivity }: Props) => {
  const { date, repeat, workout } = form.values;
  const setDate = (newDate: Date) => form.setFieldValue("date", newDate);
  const setRepeat = (newRepeat: number[]) =>
    form.setFieldValue("repeat", newRepeat);

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
        Workout date
      </FormLabel>
      <Card mb="$2">
        <DatePicker date={date} setDate={setDate} mode="date" />
      </Card>

      <FormLabel mr="auto" ml="$1">
        Schedule this for {repeat} {repeat === 1 ? "week" : "weeks"}
      </FormLabel>

      <Card mt="$2">
        <Slider
          defaultValue={[1]}
          value={[repeat]}
          onValueChange={setRepeat}
          max={10}
          min={1}
          step={1}
          size="$4"
          mx="auto"
          w="90%"
          h={60}
        >
          <Slider.Track backgroundColor="$gray200">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} backgroundColor="$primary500" />
        </Slider>
      </Card>
    </>
  );
};
