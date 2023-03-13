import { Settings, Social } from "features";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "tamagui";

import { BottomTabBar } from "./components/bottomTabBar/bottomTabBar";
import { BottomTabBarScreen } from "./components/bottomTabBar/bottomTabBarItem";
import { ProfileStack } from "./profileStack";

export const DashboardStack = () => {
  const theme = useTheme();

  const getIconColor = useCallback(
    (routeName: string, selectedTab: string) =>
      routeName === selectedTab ? theme.white.val : theme.gray300.val,
    [theme.gray300.val, theme.white.val]
  );

  const styles = StyleSheet.create({
    btnCircleUp: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary300.val,
      bottom: 18,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
    },
  });

  const renderIcon = useCallback(
    (routeName: string, selectedTab: string) => {
      let icon = "";

      switch (routeName) {
        case "Social":
          icon = "chatbox-ellipses";
          break;
        case "Settings":
          icon = "settings";
          break;
      }

      return (
        <Icon
          name={icon}
          size={25}
          color={getIconColor(routeName, selectedTab)}
        />
      );
    },
    [getIconColor]
  );

  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <BottomTabBar
      screenOptions={{
        headerShown: false,
      }}
      type="UP"
      strokeWidth={0.5}
      strokeColor={theme.primary200.val}
      height={55}
      circleWidth={55}
      bgColor={theme.primary200.val}
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity onPress={() => navigate("Profile")}>
            <Icon
              name="apps-sharp"
              color={getIconColor("Profile", selectedTab)}
              size={25}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
      initialRouteName="Profile"
    >
      <BottomTabBarScreen name="Social" component={Social} position="LEFT" />
      <BottomTabBarScreen
        name="Profile"
        component={ProfileStack}
        position="CENTER"
      />
      <BottomTabBarScreen
        name="Settings"
        component={Settings}
        position="RIGHT"
      />
    </BottomTabBar>
  );
};
