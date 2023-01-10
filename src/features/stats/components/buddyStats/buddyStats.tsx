import { useGetUser } from "api";
import { Accordion } from "components";
import React from "react";
import { FlatList } from "react-native";
import { Card, Progress, Stack, Text } from "tamagui";
import { titleCase } from "utils";

export function BuddyStats() {
  const { data: user } = useGetUser();

  if (!user) {
    return null;
  }

  const createStats = (name: string, state: number, index: number) => (
    <Stack key={`${name}-${index}-container`} marginTop="2">
      <Text key={`${name}-${index}-text`}>
        {titleCase(name)}: {state} / 10
      </Text>
      <Progress key={`${name}-${index}-progress`} value={state} max={10} />
    </Stack>
  );

  const anatomy = user.workoutBuddy.data.anatomy.sort((a, b) =>
    a.level < b.level ? 1 : -1
  );
  const level = user.workoutBuddy.data.levelStats.overall;

  return (
    <Card w="90%" marginTop={4}>
      <Accordion title="Stats" secondTitle={`Level ${level}`}>
        <FlatList
          data={anatomy}
          renderItem={({ item, index }) =>
            createStats(item.muscleGroup, item.level, index)
          }
          keyExtractor={(item, index) => `${item.muscleGroup}-${index}`}
        />
      </Accordion>
    </Card>
  );
}
