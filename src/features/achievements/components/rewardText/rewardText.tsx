import React from "react";
import { Text } from "tamagui";
import { Reward } from "types";
import { titleCase } from "utils";

interface Props {
  reward: Reward;
}

export function RewardText({ reward }: Props) {
  if (reward.rewardType === "experience") {
    return (
      <Text key={`${reward.id}`} fontSize="sm">
        <>
          {reward.amount} {reward.strengthLevel} XP
        </>
      </Text>
    );
  }

  if (reward.rewardType === "title") {
    return (
      <Text key={`${reward.id}`} fontSize="sm">
        <> &quot;{titleCase(reward.name)}&quot; </>
      </Text>
    );
  }

  return (
    <Text key={`${reward.id}`} fontSize="sm" color="$gray500">
      Unkown Reward
    </Text>
  );
}
