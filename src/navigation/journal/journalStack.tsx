import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "components";
import { History, Schedule, Stats } from "features";
import React from "react";
import { useTheme } from "tamagui";

const Tab = createMaterialTopTabNavigator();

export const JournalStack = () => {
  const theme = useTheme();
  const navigation = useNavigation();
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
      <IconButton
        position="absolute"
        bottom={92}
        right={10}
        size={64}
        color="$primary500"
        icon="add-circle"
        zIndex={3}
        onPress={() => navigation.navigate("Create" as never)}
      />
    </>
  );
};
