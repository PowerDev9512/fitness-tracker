import { Button, Card, Heading, Modal } from "components";
import React, { useEffect, useState } from "react";
import { requestPurchase, useIAP } from "react-native-iap";
import { Spinner, Text } from "tamagui";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const skus = ["com.tamagui.premium"];

export const PremiumModal = ({ isOpen, onClose }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const {
    connected,
    subscriptions,
    currentPurchase,
    currentPurchaseError,
    finishTransaction,
    getSubscriptions,
  } = useIAP();

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus });
    }
  }, [connected, getSubscriptions]);

  useEffect(() => {
    if (currentPurchaseError) {
      setError(currentPurchaseError.message);
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      finishTransaction({ purchase: currentPurchase });
    }
  }, [currentPurchase, finishTransaction]);

  let content;

  if (!connected && !error) {
    content = <Spinner size="large" />;
  } else if (subscriptions.length === 0 || error) {
    content = <Text>No products</Text>;
  } else {
    content = (
      <Text>
        {subscriptions.map((product) => (
          <Button
            key={product.productId}
            accessibilityLabel="Get Premium"
            onPress={() => requestPurchase({ sku: product.productId })}
          >
            {product.title}
          </Button>
        ))}
      </Text>
    );
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
