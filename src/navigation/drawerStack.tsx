import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements } from "features";
import React, { useCallback } from "react";

import { MainDrawer } from "./components/mainDrawer";
import NotificationBell from "./components/notificationBell";
import { DashboardStack } from "./dashboardStack";

const Drawer = createDrawerNavigator();

const DrawerStackInternal = () => {
  const createNotificationBell = useCallback(() => <NotificationBell />, []);

  return (
    <Drawer.Navigator drawerContent={MainDrawer}>
      <Drawer.Screen
        options={{
          headerRight: createNotificationBell,
        }}
        name="Dashboard"
        component={DashboardStack}
      />
      <Drawer.Screen name="Achievements" component={Achievements} />
    </Drawer.Navigator>
  );
}

export const DrawerStack = React.memo(DrawerStackInternal);
