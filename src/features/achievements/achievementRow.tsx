import React, { useCallback, useMemo } from "react";
import { Progress, Text, XStack } from "tamagui";
import { Reward, User, UserAchievement } from "types";
import { getWeightFormatter, titleCase } from "utils";

import { RewardText } from "./rewardText";

interface Props {
  achievement: UserAchievement;
  user: User;
}

type TextEntry = {
  text: string;
  max: number;
  key: string;
} | null;

export const AchievementRow = ({ achievement, user }: Props) => {
  const weightFormatter = getWeightFormatter(user);

  const createReward = (reward: Reward) => (
    <RewardText key={`${reward.id}`} reward={reward} />
  );

  const createTitle = useMemo(
    () => (
      <XStack key={`${achievement.title}-stack`} mb="$2" space={2}>
        <Text key={`${achievement.title}-title`} w="35%" fontSize={16}>
          {titleCase(achievement.title)}
        </Text>
        <Text
          key={`${achievement.title}-description`}
          w="65%"
          textAlign="right"
          color="$gray500"
        >
          {" "}
          {achievement.description}{" "}
        </Text>
      </XStack>
    ),
    [achievement]
  );

  const createTextEntry = useMemo(() => {
    if (achievement.achievementType === "streak") {
      return {
        text: `${achievement.progress}/${achievement.targetStreak} days`,
        progress: achievement.progress,
        max: achievement.targetStreak,
        key: "streak",
      };
    }

    if (achievement.achievementType === "weight") {
      const percentOfGoal = weightFormatter(
        `${achievement.progress}/${achievement.targetWeight}`,
        false
      );

      return {
        text: `${percentOfGoal} for ${achievement.targetMuscleGroup}`,
        progress: achievement.progress,
        max: achievement.targetWeight,
        key: "weight",
        reward: `Unlocks ${achievement.rewards.map(createReward)}`,
      };
    }

    return null;
  }, [achievement, user.workoutBuddy.data.streak]);

  const createText = useCallback(
    (entry: TextEntry) => {
      if (!entry) return null;

      const { text, max, key } = entry;

      const percentOfMax = Math.floor((achievement.progress / max) * 100);

      return (
        <>
          <XStack key={`${achievement.title}-${key}-stack`} mt={2}>
            <Text
              key={`${achievement.title}-${key}-title`}
              fontSize={12}
              w="35%"
            >
              {text}
            </Text>
            <Text
              key={`${achievement.title}-${key}-description`}
              fontSize={12}
              ml="auto"
            >
              Unlocks {achievement.rewards.map(createReward)}
            </Text>
          </XStack>
          <Progress
            mt="$4"
            size="$4"
            backgroundColor="$gray200"
            key={`${achievement.title}-${key}-progress`}
            value={percentOfMax}
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor="$primary300"
            />
          </Progress>
        </>
      );
    },
    [achievement, user.workoutBuddy.data.streak]
  );

  return (
    <>
      {createTitle}
      {createText(createTextEntry)}
    </>
  );
};
