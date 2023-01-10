import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MessageCircle, Settings2, User } from "@tamagui/lucide-icons";
import { Settings, Social } from "features";
import React from "react";

import { BottomTabBar } from "./components/bottomTabBar";
import { ProfileStack } from "./profileStack";

const Tab = createBottomTabNavigator();

interface IconProps {
  focused: boolean;
}

export const DashboardStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Profile"
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen
        name="Social"
        component={Social}
        options={{
          tabBarIcon: ({ focused }: IconProps) => <MessageCircle size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }: IconProps) => (
            <User color={focused ? "white" : "black"} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }: IconProps) => (
            <Settings2 color={focused ? "white" : "black"} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
