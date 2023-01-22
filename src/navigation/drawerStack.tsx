import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements } from "features";
import React from "react";

import { MainDrawer } from "./components/mainDrawer";
import { NavigationHeader } from "./components/navigationHeader";
import { DashboardStack } from "./dashboardStack";

const Drawer = createDrawerNavigator();

const DrawerStackInternal = () => {
  const createNavigationHeader = () => {
    return (props: any) => <NavigationHeader loggedIn {...props} />;
  };

  return (
    <Drawer.Navigator initialRouteName="Dashboard" drawerContent={MainDrawer}>
      <Drawer.Screen
        options={{
          header: createNavigationHeader(),
        }}
        name="Dashboard"
        component={DashboardStack}
      />
      <Drawer.Screen name="Achievements" component={Achievements} />
    </Drawer.Navigator>
  );
};

export const DrawerStack = React.memo(DrawerStackInternal);
