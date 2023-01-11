import { Camera } from "@tamagui/lucide-icons";
import { useEditWorkout, useGetUser } from "api";
import React, { useState } from "react";
import { Text, TextArea, XStack, YStack } from "tamagui";
import { StrengthActivity, Workout } from "types";

import { Button } from "../../button";
import { ImagePicker } from "../../imagePicker";
import { Input } from "../../input";
import { Modal } from "../../modal";

interface Props {
  activity: StrengthActivity;
  workout: Workout;
  onClose: () => void;
  isOpen: boolean;
}

export const StrengthModal = ({
  workout,
  activity,
  onClose,
  isOpen,
}: Props) => {
  const { data: user } = useGetUser();

  const [sets, setSets] = useState(activity.sets);
  const [reps, setReps] = useState(activity.reps);
  const [weight, setWeight] = useState(activity.weight);
  const [notes, setNotes] = useState(activity.notes);
  const [image, setImage] = useState(activity.image);

  const { mutate: editWorkout, isLoading } = useEditWorkout();

  const handleChange =
    (callback: (value: number) => void) => (value: string) => {
      const parsedValue = parseInt(value, 10);
      if (Number.isNaN(parsedValue)) {
        return;
      }
      callback(parsedValue);
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Update exercise</Modal.Header>
        <Modal.Body>
          <YStack space={2}>
            <Input
              placeholder={`Sets / ${activity.targetSets}`}
              rightElement={
                <Button onPress={() => setSets(activity.targetSets)}>
                  Fill
                </Button>
              }
              type="text"
              value={sets ?? undefined}
              onChangeText={handleChange(setSets)}
            />
            <Input
              placeholder={`Reps / ${activity.targetReps}`}
              rightElement={
                <Button onPress={() => setReps(activity.targetReps)}>
                  Fill
                </Button>
              }
              type="text"
              value={reps ?? undefined}
              onChangeText={handleChange(setReps)}
            />
            <Input
              placeholder={`Weight / ${activity.targetWeight}`}
              rightElement={
                <Button onPress={() => setWeight(activity.targetWeight)}>
                  Fill
                </Button>
              }
              type="text"
              value={weight ?? undefined}
              onChangeText={handleChange(setWeight)}
            />
            <TextArea
              placeholder="Notes"
              value={notes ?? undefined}
              onChangeText={(value) => setNotes(value)}
            />
            <XStack>
              <Text my="auto">
                {" "}
                {image ? "Image added" : "No image added"}{" "}
              </Text>
              <ImagePicker callbacks={[setImage]}>
                <Camera />
              </ImagePicker>
            </XStack>
          </YStack>
        </Modal.Body>
        <Modal.Footer>
          <XStack space={2}>
            <Button onPress={onClose}>Cancel</Button>
            <Button
              onPress={() => {
                editWorkout({
                  userId: user!.id,
                  workout: {
                    ...workout,
                    activities: workout.activities.map((a) => {
                      if (a.id === activity.id) {
                        return {
                          ...a,
                          sets,
                          reps,
                          weight,
                          notes,
                          image,
                        };
                      }
                      return a;
                    }),
                  },
                });
                onClose();
              }}
            >
              Save
            </Button>
          </XStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
