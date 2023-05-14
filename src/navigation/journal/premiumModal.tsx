import { Button, Card, Heading, Modal } from "components";
import * as InAppPurchases from "expo-in-app-purchases";
import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { Text } from "tamagui";

import { useIap } from "../../utils/useIap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal = ({ isOpen, onClose }: Props) => {
  const {
    connected,
    disconnect,
    processing,
    purchaseItem,
    getPurchases,
    getProducts,
  } = useIap();

  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);
  const [purchases, setPurchases] = useState<InAppPurchases.InAppPurchase[]>(
    []
  );

  const isSubscribed =
    purchases.length > 0 &&
    purchases.find((p) => p.productId === "premium_subscription");

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (!connected) {
      return;
    }

    getPurchases().then((p) => setPurchases(p));

    getProducts().then((products) => {
      setProducts(products);
    });
  }, [connected, getProducts, getPurchases]);

  let content;

  if (isSubscribed) {
    content = (
      <>
        <Heading mx="auto" textAlign="center" mb="$4">
          You are subscribed to Premium!
        </Heading>
        <Text mb="$4" mx="auto" textAlign="center">
          Thank you for supporting the development of this app! We hope you
          enjoy the exclusive features!
        </Text>
        <Button
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/account/subscriptions?package=fitness.tracker&sku=premium_subscription"
            )
          }
          accessibilityLabel="Manage Subscription"
        >
          Cancel Subscription?
        </Button>
      </>
    );
  } else if (products.length === 0) {
    content = (
      <>
        <Heading mx="auto" mb="$4">
          We're sorry!
        </Heading>
        <Text mx="auto" textAlign="center">
          This feature is currently unavailable! Please try again later!
        </Text>
      </>
    );
  } else {
    content = products.map((sub) => (
      <>
        <Heading mx="auto" mb="$4">
          Get Premium
        </Heading>
        <Text mb="$4" mx="auto" textAlign="center">
          Get access to exclusive features, such as AI powered workout
          recommendations, and support the development of this app!
        </Text>
        <Button
          accessibilityLabel="Get Premium"
          isLoading={processing}
          mt="$4"
          onPress={() => purchaseItem(sub.productId)}
        >
          Buy {sub.price}
        </Button>
      </>
    ));
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Card p="$4">
        {content}
        <Button
          ml="auto"
          mb="$-4"
          variant="secondary"
          accessibilityLabel="Close"
          onPress={onClose}
        >
          Close
        </Button>
      </Card>
    </Modal>
  );
};
