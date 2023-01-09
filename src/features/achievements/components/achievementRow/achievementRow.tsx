import React, { useMemo } from "react";
import { Progress, Text, XStack } from "tamagui";
import { Reward, User, UserAchievement } from "types";
import { getWeightFormatter, titleCase } from "utils";

import { RewardText } from "../rewardText/rewardText";

interface Props {
  achievement: UserAchievement;
  user: User;
}

export function AchievementRow({ achievement, user }: Props) {
  const weightFormatter = getWeightFormatter(user);

  const createReward = (reward: Reward) => (
    <RewardText key={`${reward.id}`} reward={reward} />
  );

  const createTitle = useMemo(
    () => (
      <XStack key={`${achievement.title}-stack`} space={2}>
        <Text key={`${achievement.title}-title`} w="35%" fontSize="sm">
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

  const createText = useMemo(() => {
    if (achievement.achievementType === "streak") {
      return (
        <>
          <XStack key={`${achievement.title}-streak-stack`} mt={2}>
            <Text key={`${achievement.title}-streak-title`} fontSize="sm">
              {achievement.progress}
            </Text>
            <Text key={`${achievement.title}-streak-subtitle`} fontSize="sm">
              /{achievement.targetStreak}
            </Text>
            <Text
              key={`${achievement.title}-streak-subbertitle`}
              ml="auto"
              fontSize="sm"
            >
              Unlocks {achievement.rewards.map(createReward)}
            </Text>
          </XStack>
          <Progress
            key={`${achievement.title}-streak-progress`}
            value={user.workoutBuddy.data.streak}
            max={achievement.targetStreak}
          />
        </>
      );
    }

    if (achievement.achievementType === "weight") {
      const percentOfGoal = weightFormatter(
        `${achievement.progress}/${achievement.targetWeight}`,
        false
      );
      return (
        <>
          <XStack key={`${achievement.title}-weight-stack`} mt={2}>
            <Text
              key={`${achievement.title}-weight-title`}
              fontSize="sm"
              w="35%"
            >{`${percentOfGoal} for ${achievement.targetMuscleGroup}`}</Text>
            <Text
              key={`${achievement.title}-weight-description`}
              fontSize="sm"
              ml="auto"
            >
              Unlocks {achievement.rewards.map(createReward)}
            </Text>
          </XStack>
          <Progress
            key={`${achievement.title}-weight-progress`}
            value={achievement.progress}
            max={achievement.targetWeight}
          />
        </>
      );
    }
  }, [achievement, user.workoutBuddy.data.streak]);

  return (
    <>
      {createTitle}
      {createText}
    </>
  );
}
