import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements } from "features";
import React from "react";

import { SideBarHeader } from "./sideBarHeader";
import { SideBar } from "./sideBar";
import { DashboardStack } from "../dashboard/dashboardStack";

const Drawer = createDrawerNavigator();

const DrawerStackInternal = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={SideBar}
      screenOptions={{
        header: (props) => <SideBarHeader name={props.route.name} />,
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardStack} />
      <Drawer.Screen name="Achievements" component={Achievements} />
    </Drawer.Navigator>
  );
};

export const SideBarStack = React.memo(DrawerStackInternal);
