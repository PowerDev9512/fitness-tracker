import { Button, Card, Heading, Modal } from "components";
import * as InAppPurchases from "expo-in-app-purchases";
import React, { useEffect, useState } from "react";
import { Spinner, Text } from "tamagui";

import { useIap } from "../../utils/useIap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const skus = ["premium_subscription"];

export const PremiumModal = ({ isOpen, onClose }: Props) => {
  const { connected, processing, purchaseItem, getProducts } = useIap();
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);
  const [purchases, setPurchases] = useState<InAppPurchases.InAppPurchase[]>([]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    getProducts().then((products) => {
      setProducts(products);
    });
  }, [connected, getProducts]);

  let content;

  if (products.length === 0 || error) {
    content = (
      <Text mx="auto" textAlign="center">
        This feature is currently unavailable! Please try again later!
      </Text>
    );
  } else {
    content = products.map((sub) => (
      <Button
        accessibilityLabel="Get Premium"
        isLoading={processing}
        onPress={() => purchaseItem(sub.productId)}
      >
        Buy ${sub.price}
      </Button>
    ));
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Card p="$4">
        <Heading mx="auto" mb="$4">
          Get Premium
        </Heading>
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
