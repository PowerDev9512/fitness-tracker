import { createDrawerNavigator } from "@react-navigation/drawer";
import { Achievements } from "features";
import React from "react";

import { SideBar } from "./sideBar";
import { SideBarHeader } from "./sideBarHeader";
import { DashboardStack } from "../dashboard/dashboardStack";
import { PremiumModal } from "../journal/premiumModal";

const Drawer = createDrawerNavigator();

const DrawerStackInternal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <PremiumModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => (
          <SideBar {...props} onPremiumPress={() => setIsOpen(true)} />
        )}
        screenOptions={{
          header: (props) => <SideBarHeader name={props.route.name} />,
        }}
      >
        <Drawer.Screen name="Dashboard" component={DashboardStack} />
        <Drawer.Screen name="Achievements" component={Achievements} />
      </Drawer.Navigator>
    </>
  );
};

export const SideBarStack = React.memo(DrawerStackInternal);
