import { useGetUser } from "api";
import { Accordion, Card } from "components";
import React from "react";
import { FlatList } from "react-native";
import { Progress, Stack, Text } from "tamagui";
import { titleCase } from "utils";

export const BuddyStats = () => {
  const { data: user } = useGetUser();

  if (!user) {
    return null;
  }

  const createStats = (
    name: string,
    currentLevel: number,
    state: number,
    maxLevel: number,
    index: number
  ) => (
    <Stack key={`${name}-${index}-container`} marginTop="$2">
      <Text key={`${name}-${index}-text`}>
        {titleCase(name)}: {currentLevel} / {maxLevel}
      </Text>
      <Progress
        key={`${name}-${index}-progress`}
        value={(currentLevel / maxLevel) * 100}
      >
        <Progress.Indicator backgroundColor="$primary500" animation="bouncy" />
      </Progress>
    </Stack>
  );

  const anatomy = user.workoutBuddy.data.anatomy.sort((a, b) =>
    a.levelData.currentLevel < b.levelData.currentLevel ? 1 : -1
  );

  return (
    <Card p="$4">
      <Accordion title="Stats">
        <FlatList
          data={anatomy}
          renderItem={({ item, index }) =>
            createStats(
              item.muscleGroup,
              item.levelData.currentLevel,
              item.levelData.currentLevelProgress,
              item.levelData.maxLevel,
              index
            )
          }
          keyExtractor={(item, index) => `${item.muscleGroup}-${index}`}
        />
      </Accordion>
    </Card>
  );
};
