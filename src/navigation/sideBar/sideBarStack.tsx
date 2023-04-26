import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements, Store } from "features";
import React from "react";

import { SideBar } from "./sideBar";
import { SideBarHeader } from "./sideBarHeader";
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
      {/*<Drawer.Screen name="Store" component={Store} />*/}
    </Drawer.Navigator>
  );
};

export const SideBarStack = React.memo(DrawerStackInternal);
