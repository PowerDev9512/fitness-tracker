import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements } from "features";
import React from "react";

import { DrawerHeader } from "./components/drawerHeader";
import { MainDrawer } from "./components/mainDrawer";
import { DashboardStack } from "./dashboardStack";

const Drawer = createDrawerNavigator();

const DrawerStackInternal = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={MainDrawer}
      screenOptions={{
        header: (props) => <DrawerHeader name={props.route.name} />,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardStack} />
      <Drawer.Screen name="Achievements" component={Achievements} />
    </Drawer.Navigator>
  );
};

export const DrawerStack = React.memo(DrawerStackInternal);
