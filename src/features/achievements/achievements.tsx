import { useGetUser, useRecordAchievement, useUserAchievements } from "api";
import { FilterOption, Filters, Screen } from "components";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button, Card, Stack } from "tamagui";
import { AchievementTypes, MuscleGroups, Reward } from "types";

import { AchievementRow } from "./components/achievementRow/achievementRow";
import { RewardsModal } from "./components/rewardsModal/rewardsModal";

const filterOptions: FilterOption[] = [
  {
    name: "muscleGroup",
    values: Object.values(MuscleGroups),
    placeholder: "Muscle",
  },
  {
    name: "achievementType",
    values: Object.values(AchievementTypes),
    placeholder: "Category",
  },
];

export const Achievements = () => {
  const { data: user } = useGetUser();
  const { data: achievements } = useUserAchievements({ userId: user?.id ?? 0 });
  const {
    data: recordResponse,
    mutate: recordAchievement,
    isLoading: recordingAchievement,
  } = useRecordAchievement();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filters, setFilters] = useState<Record<string, string | undefined>>({
    muscleGroup: undefined,
    achievementType: undefined,
  });

  useEffect(() => {
    if (recordResponse) {
      setRewards(recordResponse);
    }
  }, [recordResponse]);

  const isLoading = !user || !achievements;

  const filteredAchievements = achievements?.filter((achievement) => {
    if (filters.muscleGroup && achievement.achievementType === "weight") {
      return (
        achievement.targetMuscleGroup.toLowerCase() ===
        filters.muscleGroup.toLowerCase()
      );
    }

    if (filters.achievementType) {
      return achievement.achievementType === filters.achievementType;
    }

    return true;
  });

  return (
    <Screen loading={isLoading}>
      <RewardsModal rewards={rewards} onClose={() => setRewards([])} />
      {!isLoading && (
        <Stack mx="auto" mt={4}>
          <Filters
            filterOptions={filterOptions}
            filters={filters}
            setFilters={setFilters}
          />
          <FlatList
            style={{ width: "90%", marginHorizontal: "auto" }}
            data={filteredAchievements}
            keyExtractor={(item) => item.title}
            renderItem={({ item: achievement }) => (
              <Card key={`${achievement.title}-box`} my={4}>
                <AchievementRow user={user} achievement={achievement} />
                {achievement.isCompleted && (
                  <Button
                    mt="$10"
                    onPress={() =>
                      recordAchievement({
                        userId: user.id,
                        achievementId: achievement.id,
                      })
                    }
                    key={`${achievement.title}-button`}
                  >
                    Claim
                  </Button>
                )}
              </Card>
            )}
          />
        </Stack>
      )}
    </Screen>
  );
};
