import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { History, Schedule, Stats } from "features";
import React from "react";
import { useTheme } from "tamagui";

import { CreateButton } from "./createButton";
import { PremiumModal } from "./premiumModal";
import { RecommendWorkoutModal } from "./recommendWorkoutModal";

const Tab = createMaterialTopTabNavigator();

export const JournalStack = () => {
  const theme = useTheme();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = React.useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("Stats");

  const screens = [
    {
      name: "History",
      component: History,
    },
    {
      name: "Stats",
      component: Stats,
    },
    {
      name: "Schedule",
      component: Schedule,
    },
  ];

  return (
    <>
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => {
          setIsPremiumModalOpen(false);
        }}
      />
      <RecommendWorkoutModal
        isOpen={isRecommendationModalOpen}
        onClose={() => {
          setIsRecommendationModalOpen(false);
        }}
      />
      <Tab.Navigator
        style={{ backgroundColor: theme.backgroundAccent.val }}
        screenOptions={(props) => ({
          swipeEnabled: false,
          tabBarIndicator: () => null,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color:
              props.route.name === selectedTab
                ? theme.white.val
                : theme.gray200.val,
          },
          tabBarStyle: {
            backgroundColor: theme.primary100.val,
            elevation: 0,
            shadowOpacity: 0,
            borderRadius: 10,
            width: "90%",
            marginLeft: "5%",
          },
        })}
        initialRouteName="Stats"
      >
        {screens.map((screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            listeners={{
              tabPress: () => {
                setSelectedTab(screen.name);
              },
            }}
            component={screen.component}
          />
        ))}
      </Tab.Navigator>
      <CreateButton
        onPromptPremium={() => setIsPremiumModalOpen(true)}
        onPromptRecommendation={() => setIsRecommendationModalOpen(true)}
      />
    </>
  );
};
