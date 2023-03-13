import { useGetUser, useRecordAchievement, useUserAchievements } from "api";
import { Card, FilterOption, Filters, Screen, Skeleton } from "components";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button, Stack } from "tamagui";
import {
  AchievementTypes,
  MuscleGroups,
  Reward,
  User,
  UserAchievement,
} from "types";

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
  const { data: achievements, isLoading: achievementsLoading } =
    useUserAchievements({ userId: user?.id ?? 0 });
  const { data: recordResponse, mutate: recordAchievement } =
    useRecordAchievement();

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

  const renderAchievement = (achievement: UserAchievement, user: User) => {
    if (!achievements || !user) {
      return <Skeleton key={`${achievement.title}-skeleton`} />;
    }

    return (
      <Card p="$4" key={`${achievement.title}-box`} my={4}>
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
    );
  };

  return (
    <Screen>
      <RewardsModal rewards={rewards} onClose={() => setRewards([])} />
      <Stack mx="auto" w="124%" mt={4}>
        <Filters
          filterOptions={filterOptions}
          filters={filters}
          setFilters={setFilters}
        />

        {achievementsLoading && (
          <FlatList
            style={{ width: "90%", marginHorizontal: "auto" }}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <Skeleton my="$2" mx="auto" h={150} />}
          />
        )}

        {achievements && user && (
          <FlatList
            style={{ width: "90%", marginHorizontal: "auto" }}
            data={filteredAchievements ?? []}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => renderAchievement(item, user)}
          />
        )}
      </Stack>
    </Screen>
  );
};
