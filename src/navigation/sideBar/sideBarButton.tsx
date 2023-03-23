import { useDrawerStatus } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { IconButton } from "components";
import React from "react";

export const SideBarButton = () => {
  const navigation = useNavigation();
  const isDrawerOpen = useDrawerStatus() === "open";

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      navigation.dispatch(DrawerActions.closeDrawer());
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  return (
    <IconButton
      onPress={toggleDrawer}
      icon="ios-menu-sharp"
      color="$gray700"
      size={28}
      px="$4"
    />
  );
};
