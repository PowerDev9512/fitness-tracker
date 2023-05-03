import { useNavigation } from "@react-navigation/native";
import { Check } from "@tamagui/lucide-icons";
import { useRecommendation } from "api";
import { Button, Card, Heading, Modal } from "components";
import React, { useEffect, useMemo, useState } from "react";
import {
  Checkbox,
  Label,
  ScrollView,
  SizeTokens,
  Spinner,
  Text,
  XStack,
} from "tamagui";

import { useStore } from "../../store/store";
import { Equipments, MuscleGroups } from "../../types/domain";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendWorkoutModal = ({ isOpen, onClose }: Props) => {
  const { userId } = useStore();
  const [muscles, setMuscles] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const {
    mutate: getRecommendation,
    data: recommendation,
    isLoading: gettingRecommendation,
  } = useRecommendation();
  const navigation = useNavigation();

  useEffect(() => {
    if (recommendation && recommendation.activities.length > 0) {
      onClose();
      navigation.navigate(
        "Create" as never,
        { workout: recommendation } as never
      );
    }
  }, [recommendation]);

  const muscleOptions = useMemo(() => {
    const createCheckbox = (muscle: string) => {
      const isSelected = muscles.includes(muscle);

      return (
        <CheckboxWithLabel
          size="$4"
          defaultChecked={isSelected}
          onCheck={() => {
            if (isSelected) {
              setMuscles(muscles.filter((m) => m !== muscle));
            } else {
              setMuscles([...muscles, muscle]);
            }
          }}
        >
          {muscle}
        </CheckboxWithLabel>
      );
    };

    return MuscleGroups.map((_, index) => {
      if (index % 2 !== 0) {
        return null;
      }

      const muscle = MuscleGroups[index];
      const nextMuscle = MuscleGroups[index + 1];

      return (
        <XStack space="$5" w="20%" key={index}>
          {createCheckbox(muscle)}
          {nextMuscle && createCheckbox(nextMuscle)}
        </XStack>
      );
    });
  }, [muscles]);

  const equipmentOptions = useMemo(() => {
    const createCheckbox = (item: string) => {
      const isSelected = equipment.includes(item);

      return (
        <CheckboxWithLabel
          size="$4"
          defaultChecked={isSelected}
          onCheck={() => {
            if (isSelected) {
              setEquipment(equipment.filter((m) => m !== item));
            } else {
              setEquipment([...equipment, item]);
            }
          }}
        >
          {item}
        </CheckboxWithLabel>
      );
    };

    return Equipments.map((_, index) => {
      if (index % 2 !== 0) {
        return null;
      }

      const equipment = Equipments[index];
      const nextEquipment = Equipments[index + 1];

      return (
        <XStack space="$5" w="20%" key={index}>
          {createCheckbox(equipment)}
          {nextEquipment && createCheckbox(nextEquipment)}
        </XStack>
      );
    });
  }, [equipment]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Card p="$4">
        <ScrollView h="90%" nestedScrollEnabled>
          <Heading mx="auto" mb="$4" textAlign="center">
            Select the Muscle Groups you want to train
          </Heading>
          {muscleOptions}
          <Heading mx="auto" mb="$4" mt="$4" textAlign="center">
            Select the Equipment you have available
          </Heading>
          {equipmentOptions}
        </ScrollView>
        <XStack>
          <Button
            ml="auto"
            variant="secondary"
            accessibilityLabel="Close"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            ml="auto"
            accessibilityLabel="Get Recommendation"
            isLoading={gettingRecommendation}
            onPress={() => {
              getRecommendation({
                muscleGroups: muscles,
                equipment,
                userId: userId ?? -1,
              });
            }}
          >
            Get recommendation
          </Button>
        </XStack>
      </Card>
    </Modal>
  );
};

interface CheckboxProps {
  size: SizeTokens;
  defaultChecked?: boolean;
  onCheck: () => void;
  children: React.ReactNode;
}

export const CheckboxWithLabel = (props: CheckboxProps) => {
  const id = `checkbox-${props.size.toString().slice(1)}`;
  return (
    <XStack ml="$4" w={120} alignItems="center" space="$4">
      <Checkbox
        id={id}
        size={props.size}
        defaultChecked={props.defaultChecked}
        onPress={props.onCheck}
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={props.size} htmlFor={id}>
        {props.children}
      </Label>
    </XStack>
  );
};
