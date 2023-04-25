import { useClaimEntry, useGetUser, useStoreEntries } from "api";
import { Button, Card, Heading, Screen } from "components";
import { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { useIAP, requestPurchase, withIAPContext } from "react-native-iap";
import Toast from "react-native-toast-message";
import { Text, XStack } from "tamagui";
import { Reward, StoreEntry } from "types";

const compareRewards = (a: Reward, b: Reward) => {
  if (a.rewardType === "title" && b.rewardType === "title") {
    return a.name.toLowerCase() === b.name.toLowerCase();
  }
  return false;
};

const Store = () => {
  const { data: user } = useGetUser();
  const { data: storeEntries } = useStoreEntries();
  const { mutate: claimReward } = useClaimEntry();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { products, currentPurchase, currentPurchaseError, getProducts } =
    useIAP();

  getProducts({ skus: ["supporter_title_1"] })

  const buyItem = (item: StoreEntry) => {
    const matchingProduct = products.find(
      (product) => product.productId === item.productId
    );

    if (matchingProduct) {
      requestPurchase({ sku: matchingProduct.productId });
    }
  };

  useEffect(() => {
    getProducts({ skus: storeEntries?.map((entry) => entry.productId) ?? [] });
  }, [getProducts, storeEntries]);

  useEffect(() => {
    if (loadingId) {
      const timeout = setTimeout(() => {
        setLoadingId(null);
        Toast.show({
          text1: "Purchases are currently disabled",
          text2: "We are working on fixing this issue.",
          type: "error",
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [loadingId]);

  useEffect(() => {
    if (currentPurchaseError) {
      setLoadingId(null);
      Toast.show({
        text1: "Error",
        text2: currentPurchaseError.message,
        type: "error",
      });
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      setLoadingId(null);

      const reward = storeEntries?.find(
        (entry) => entry.productId === currentPurchase.productId
      )?.reward;

      if (reward) {
        Toast.show({
          text1: "Success",
          text2: "You're purchase was successful",
          type: "success",
        });

        claimReward({ reward });
      }
    }
  }, [claimReward, currentPurchase, storeEntries]);

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
        <Button
          disabled={alreadyBought}
          onPress={() => {
            setLoadingId(storeEntry.productId);
            return buyItem(storeEntry);
          }}
          isLoading={loadingId === storeEntry.productId}
        >
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

export default withIAPContext(Store);
