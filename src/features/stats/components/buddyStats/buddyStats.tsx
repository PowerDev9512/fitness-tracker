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

  const createStats = (name: string, state: number, index: number) => (
    <Stack key={`${name}-${index}-container`} marginTop="$2">
      <Text key={`${name}-${index}-text`}>
        {titleCase(name)}: {state} / 10
      </Text>
      <Progress key={`${name}-${index}-progress`} value={state} max={10}>
        <Progress.Indicator animation="bouncy" />
      </Progress>
    </Stack>
  );

  const anatomy = user.workoutBuddy.data.anatomy.sort((a, b) =>
    a.level < b.level ? 1 : -1
  );
  const level = user.workoutBuddy.data.levelStats.overall;

  return (
    <Card p="$4">
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
};
