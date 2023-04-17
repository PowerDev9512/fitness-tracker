import { useGetUser, useStoreEntries } from "api";
import { Button, Card, Heading, Screen } from "components";
import { useMemo } from "react";
import { FlatList } from "react-native";
import { Text, XStack } from "tamagui";
import { Reward, StoreEntry, Title } from "types";

const compareRewards = (a: Reward, b: Reward) => {
  if (a.rewardType === "title" && b.rewardType === "title") {
    return a.name.toLowerCase() === b.name.toLowerCase();
  }
  return false;
};

export const Store = () => {
  const { data: user } = useGetUser();
  const { data: storeEntries } = useStoreEntries();

  const buyItem = (item: StoreEntry) => {
    console.log("buying item", item);
  };

  const rewards = useMemo(() => user?.inventory ?? [], [user]);

  const renderStoreEntry = (storeEntry: StoreEntry, rewards: Reward[]) => {
    const alreadyBought =
      rewards.find((reward) => compareRewards(reward, storeEntry.reward)) !==
      undefined;

    return (
      <Card p="$4">
        <XStack mb="$2" alignContent="center" alignItems="center">
          <Heading w="80%">{storeEntry.title}</Heading>
          <Text ml="auto" fontWeight="bold">
            {storeEntry.price.toFixed(2)} $
          </Text>
        </XStack>
        <Text mb="$4">{storeEntry.description}</Text>
        <Button disabled={alreadyBought} onPress={() => buyItem(storeEntry)}>
          {alreadyBought ? "Already bought" : "Buy"}
        </Button>
      </Card>
    );
  };

  return (
    <Screen>
      {storeEntries && (
        <FlatList
          style={{ width: "100%" }}
          data={storeEntries ?? []}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => renderStoreEntry(item, rewards)}
        />
      )}
    </Screen>
  );
};
