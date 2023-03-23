import React from "react";
import { Text } from "tamagui";
import { Reward } from "types";
import { titleCase } from "utils";

interface Props {
  reward: Reward;
}

export const RewardText = ({ reward }: Props) => {
  if (reward.rewardType === "experience") {
    return (
      <Text key={`${reward.id}`} fontSize={12}>
        <>
          {reward.amount} {reward.strengthLevel} XP
        </>
      </Text>
    );
  }

  if (reward.rewardType === "title") {
    return (
      <Text key={`${reward.id}`} fontSize={12}>
        <> &quot;{titleCase(reward.name)}&quot; </>
      </Text>
    );
  }

  return (
    <Text key={`${reward.id}`} fontSize={12} color="$gray500">
      Unkown Reward
    </Text>
  );
};
