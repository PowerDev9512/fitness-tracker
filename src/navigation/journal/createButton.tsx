import { useNavigation } from "@react-navigation/native";
import { IconButton } from "components";
import { InAppPurchase } from "expo-in-app-purchases";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Text } from "tamagui";

import { useIap } from "../../utils/useIap";

interface Props {
  onPromptPremium: () => void;
  onPromptRecommendation: () => void;
}

export const CreateButton = ({
  onPromptPremium,
  onPromptRecommendation,
}: Props) => {
  const navigation = useNavigation();
  const [purchases, setPurchases] = useState<InAppPurchase[]>([]);
  const { connected, getPurchases } = useIap();

  const isSubscribed =
    purchases.length > 0 &&
    purchases.find((p) => p.productId === "premium_subscription")?.acknowledged !== undefined;

  const createWorkoutButtonY = useSharedValue(0);
  const recommendWorkoutButtonY = useSharedValue(0);

  useEffect(() => {
    if (!connected) {
      return;
    }

    getPurchases().then((purchases) => {
      setPurchases(purchases);
    });
  }, [connected, getPurchases]);

  const onPress = () => {
    if (
      createWorkoutButtonY.value !== 0 &&
      recommendWorkoutButtonY.value !== 0
    ) {
      createWorkoutButtonY.value = withTiming(0);
      recommendWorkoutButtonY.value = withTiming(0);
    } else {
      createWorkoutButtonY.value = withTiming(-90);
      recommendWorkoutButtonY.value = withTiming(-160);
    }
  };

  const onPressCreateWorkout = () => {
    navigation.navigate("Create" as never);
    onPress();
  };

  const onPressRecommendWorkout = () => {
    if (!isSubscribed) {
      onPromptPremium();
    } else {
      onPromptRecommendation();
    }
    onPress();
  };

  const createWorkoutButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: createWorkoutButtonY.value }],
      opacity: interpolate(createWorkoutButtonY.value, [0, -90], [0, 1]),
    };
  });

  const recommendWorkoutButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: recommendWorkoutButtonY.value }],
      opacity: interpolate(recommendWorkoutButtonY.value, [0, -160], [0, 1]),
    };
  });

  return (
    <>
      <Animated.View style={[createWorkoutButtonStyle]}>
        <Text
          position="absolute"
          bottom={108}
          right={80}
          color="$primary500"
          zIndex={2}
        >
          Recommend Workout {!isSubscribed && "\n  (Purchase Required)"}
        </Text>

        <IconButton
          position="absolute"
          bottom={92}
          right={22}
          size={50}
          color="$primary500"
          icon="logo-ionitron"
          zIndex={2}
          onPress={onPressRecommendWorkout}
        />
      </Animated.View>
      <Animated.View style={[recommendWorkoutButtonStyle]}>
        <Text
          position="absolute"
          bottom={108}
          right={80}
          color="$primary500"
          zIndex={1}
        >
          Create Workout
        </Text>
        <IconButton
          position="absolute"
          bottom={92}
          right={18}
          size={52}
          color="$primary500"
          icon="md-create-outline"
          zIndex={1}
          onPress={onPressCreateWorkout}
        />
      </Animated.View>
      <IconButton
        position="absolute"
        bottom={92}
        right={10}
        size={70}
        color="$primary500"
        icon="add-circle"
        zIndex={3}
        onPress={onPress}
      />
    </>
  );
};
