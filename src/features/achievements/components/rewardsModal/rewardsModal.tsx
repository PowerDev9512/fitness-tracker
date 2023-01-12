import { Button, Modal } from "components";
import React from "react";
import { Text } from "tamagui";
import { Reward } from "types";
import { titleCase } from "utils";

interface Props {
  rewards: Reward[];
  onClose: () => void;
}

export const RewardsModal = ({ rewards, onClose }: Props) => {
  return (
    <Modal isOpen={rewards.length > 0} onClose={onClose}>
      <Text>Rewards Unlocked!</Text>
      {rewards.map((reward) => {
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
              <> Title unlocked! &quot;{titleCase(reward.name)}&quot; </>
            </Text>
          );
        }

        return (
          <Text key={`${reward.id}`} fontSize={12} color="gray.500">
            Unkown Reward
          </Text>
        );
      })}
      <Button onPress={onClose}>Close</Button>
    </Modal>
  );
};
