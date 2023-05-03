import * as InAppPurchases from "expo-in-app-purchases";
import { useState, useEffect } from "react";

const IAP_SKUS = ["premium_subscription"];

export const useIap = () => {
  const [processing, setProcessing] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    InAppPurchases.connectAsync()
      .then(() => {
        setConnected(true);
      })
      .catch(() => {
        setConnected(false);
      });

    setupEventListeners();
  }, []);

  const getProducts = async () => {
    const { responseCode, results } = await InAppPurchases.getProductsAsync(
      IAP_SKUS
    );

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results ?? [];
    } else {
      return [];
    }
  };

  const getPurchases = async () => {
    const { responseCode, results } =
      await InAppPurchases.getPurchaseHistoryAsync();

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results ?? [];
    } else {
      return [];
    }
  };

  const purchaseItem = async (sku: string) => {
    setProcessing(true);
    await InAppPurchases.purchaseItemAsync(sku);
  };

  const setupEventListeners = async () => {
    InAppPurchases.setPurchaseListener(
      ({ responseCode, results, errorCode }) => {
        // Purchase was successful
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          (results ?? []).forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              InAppPurchases.finishTransactionAsync(purchase, true);
            }
          });
        } else if (
          responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
        ) {
          console.log("User canceled the transaction");
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          console.log(
            "User does not have permissions to buy but requested parental approval (iOS only)"
          );
        } else {
          console.warn(
            `Something went wrong with the purchase. Received errorCode ${errorCode}`
          );
        }

        setProcessing(false);
      }
    );
  };

  return {
    getProducts,
    getPurchases,
    purchaseItem,
    processing,
    connected,
  };
};
