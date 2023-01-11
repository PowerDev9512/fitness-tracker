import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { History, Schedule, Stats } from "features";
import React from "react";
import { useTheme } from "tamagui";

const Tab = createMaterialTopTabNavigator();

export const ProfileStack = () => {
  const theme = useTheme();

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
    <Tab.Navigator
      style={{ backgroundColor: theme.backgroundStrong.val }}
      screenOptions={(props) => ({
        swipeEnabled: false,
        tabBarIndicator: () => null,
        tabBarStyle: {
          backgroundColor: "white",
          elevation: 0,
          shadowOpacity: 0,
          height: 50,
          marginTop: 15,
          borderRadius: 75,
          width: "95%",
          marginLeft: "2.5%",
        },
      })}
      initialRouteName="Stats"
    >
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
};
