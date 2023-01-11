import { Camera } from "@tamagui/lucide-icons";
import { useEditWorkout, useGetUser } from "api";
import React, { useState } from "react";
import { Text, TextArea, XStack, YStack } from "tamagui";
import { CardioActivity, Workout } from "types";

import { Button } from "../../button";
import { ImagePicker } from "../../imagePicker";
import { Input } from "../../input";
import { Modal } from "../../modal";

interface Props {
  activity: CardioActivity;
  workout: Workout;
  onClose: () => void;
  isOpen: boolean;
}

export const CardioModal = ({ workout, activity, onClose, isOpen }: Props) => {
  const { data: user } = useGetUser();

  const [distance, setDistance] = useState(activity.distance);
  const [duration, setDuration] = useState(activity.duration);
  const [notes, setNotes] = useState(activity.notes);
  const [image, setImage] = useState(activity.image);

  const { mutate: editWorkout } = useEditWorkout();

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
              placeholder="Distance"
              rightElement={
                <Button onPress={() => setDistance(activity.targetDistance)}>
                  Fill
                </Button>
              }
              type="text"
              value={distance ?? undefined}
              onChangeText={handleChange(setDistance)}
            />
            <Input
              placeholder="Duration"
              rightElement={
                <Button onPress={() => setDuration(activity.targetDuration)}>
                  Fill
                </Button>
              }
              type="text"
              value={duration ?? undefined}
              onChangeText={handleChange(setDuration)}
            />
            <TextArea
              placeholder="Notes"
              value={notes ?? undefined}
              onChangeText={(value) => setNotes(value)}
            />
            <XStack>
              <Text my="auto">{image ? "Image added" : "No image added"}</Text>
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
                          distance,
                          duration,
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
