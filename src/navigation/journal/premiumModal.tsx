import { Button, Card, Heading, Modal } from "components";
import * as InAppPurchases from "expo-in-app-purchases";
import React, { useEffect, useState } from "react";
import { Text } from "tamagui";

import { useIap } from "../../utils/useIap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal = ({ isOpen, onClose }: Props) => {
  const { connected, processing, purchaseItem, getProducts } = useIap();
  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    getProducts().then((products) => {
      setProducts(products);
    });
  }, [connected, getProducts]);

  let content;

  if (products.length === 0) {
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
        mt="$4"
        onPress={() => purchaseItem(sub.productId)}
      >
        Buy {sub.price}
      </Button>
    ));
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Card p="$4">
        <Heading mx="auto" mb="$4">
          Get Premium
        </Heading>
        <Text mb="$4" mx="auto" textAlign="center">
          Get access to exclusive features, such as AI powered workout
          recommendations, and support the development of this app!
        </Text>
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
