import {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  DefaultNavigatorOptions,
  ParamListBase,
  TabNavigationState,
  TabRouterOptions,
} from "@react-navigation/native";
import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  ColorValue,
  Dimensions,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { scale } from "react-native-size-scaling";
import Svg, { Path } from "react-native-svg";

import { getPath, getPathUp } from "./path";
import { styles } from "./styles";

const { width: maxW } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

type Props = {
  ref: React.MutableRefObject<any>;
  type?: "DOWN" | "UP";
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  borderTopLeftRight?: boolean;
  circleWidth?: number;
  bgColor?: string;
  initialRouteName: string;
  strokeWidth?: number;
  strokeColor?: ColorValue;
  renderCircle: ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
  tabBar?: ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  }) => JSX.Element;
};

export type NavigatorBottomBarProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  Props &
  TabRouterOptions;

export const BottomTabBar = React.forwardRef<any, NavigatorBottomBarProps>(
  (props, ref) => {
    const SVG: any = Svg;
    const PATH: any = Path;

    const {
      type = "DOWN",
      style,
      width = null,
      height = 65,
      circleWidth = 50,
      bgColor,
      initialRouteName,
      tabBar,
      renderCircle,
      borderTopLeftRight = false,
      strokeWidth = 0,
      strokeColor,
    } = props;

    const [itemLeft, setItemLeft] = useState<any[]>([]);
    const [itemRight, setItemRight] = useState<any[]>([]);
    const [maxWidth, setMaxWidth] = useState<number>(width ?? maxW);
    const [isShow, setIsShow] = useState(true);
    const children = props?.children as any[];

    useImperativeHandle(ref, () => {
      return { setVisible };
    });

    const setVisible = (visible: boolean) => {
      setIsShow(visible);
    };

    useEffect(() => {
      const { width: w } = Dimensions.get("window");
      if (!width) {
        setMaxWidth(w);
      }
    }, [width]);

    const _renderButtonCenter = (focusedTab: string, navigate: any) => {
      const getTab = children.filter(
        (e: any) => e?.props?.position === "CENTER"
      )[0]?.props?.name;

      return renderCircle({
        routeName: getTab,
        selectedTab: focusedTab,
        navigate: (selectTab: string) => {
          if (selectTab) {
            navigate(selectTab);
          }
        },
      });
    };

    useEffect(() => {
      const arrLeft: any = children.filter(
        (item) => item?.props?.position === "LEFT"
      );
      const arrRight: any = children.filter(
        (item) => item?.props?.position === "RIGHT"
      );

      setItemLeft(arrLeft);
      setItemRight(arrRight);
    }, [children, initialRouteName]);

    const d =
      type === "DOWN"
        ? getPath(
            maxWidth,
            height,
            circleWidth >= 50 ? circleWidth : 50,
            borderTopLeftRight
          )
        : getPathUp(
            maxWidth,
            height + 30,
            circleWidth >= 50 ? circleWidth : 50,
            borderTopLeftRight
          );

    const renderItem = ({ color, routeName, navigate }: any) => {
      return (
        <TouchableOpacity
          key={routeName}
          style={styles.itemTab}
          onPress={() => navigate(routeName)}
        >
          <Text style={{ color }}>{routeName}</Text>
        </TouchableOpacity>
      );
    };

    const MyTabBar = (props: any) => {
      const { state, navigation } = props;
      const focusedTab = state?.routes[state.index].name;

      if (!isShow) {
        return null;
      }

      return (
        <View style={[styles.container, style]}>
          <SVG
            width={maxWidth}
            height={scale(height) + (type === "DOWN" ? 0 : scale(30))}
          >
            <PATH
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              {...{ d }}
            />
          </SVG>
          <View
            style={[
              styles.main,
              { width: maxWidth },
              type === "UP" && styles.top30,
            ]}
          >
            <View style={[styles.rowLeft, { height: scale(height) }]}>
              {itemLeft.map((item: any, index) => {
                const routeName: string = item?.props?.name;

                if (tabBar === undefined) {
                  return renderItem({
                    routeName,
                    color: focusedTab === routeName ? "blue" : "gray",
                    navigate: navigation.navigate,
                  });
                }

                return (
                  <View style={styles.flex1} key={index.toString()}>
                    {tabBar({
                      routeName,
                      selectedTab: focusedTab,
                      navigate: (selectTab: string) => {
                        if (selectTab !== focusedTab) {
                          navigation.navigate({
                            name: routeName,
                            merge: true,
                          });
                        }
                      },
                    })}
                  </View>
                );
              })}
            </View>
            {_renderButtonCenter(focusedTab, navigation.navigate)}
            <View style={[styles.rowRight, { height: scale(height) }]}>
              {itemRight.map((item: any, index) => {
                const routeName = item?.props?.name;

                if (tabBar === undefined) {
                  return renderItem({
                    routeName,
                    color: focusedTab === routeName ? "blue" : "gray",
                    navigate: navigation.navigate,
                  });
                }

                return (
                  <View style={styles.flex1} key={index.toString()}>
                    {tabBar({
                      routeName,
                      selectedTab: focusedTab,
                      navigate: (selectTab: string) => {
                        if (selectTab !== focusedTab) {
                          navigation.navigate({
                            name: routeName,
                            merge: true,
                          });
                        }
                      },
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    };

    return (
      <Tab.Navigator {...props} tabBar={MyTabBar}>
        {children?.map((e: any, index: number) => {
          return <Tab.Screen key={index.toString()} {...e.props} />;
        })}
      </Tab.Navigator>
    );
  }
);
