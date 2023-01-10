import { RawEditUserRequest, useEditUser, useGetUser } from "api";
import { Avatar, FormLabel, Input, Screen, Select } from "components";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Stack, YStack } from "tamagui";
import { Badge, Image, Title } from "types";

import { UserSetting } from "./components/userSetting/userSetting";
import { SettingSection, settingsSections } from "./settingsSections";

function SettingsInternal() {
  const { data: user } = useGetUser();

  const initialState = useMemo(
    () =>
      ({
        userId: user?.id ?? 0,
        username: user?.username ?? "",
        email: user?.email ?? "",
        weightUnit: user?.userSettings.weightUnit ?? "pounds",
        measurementUnit: user?.userSettings.measurementUnit ?? "metric",
        darkMode: user?.userSettings.darkMode ? "true" : "false",
        weeklyWorkountAmountGoal: user?.weeklyWorkoutAmountGoal ?? 0,
        height: user?.height ?? 0,
        weight: user?.weight ?? 0,
        age: user?.age ?? 0,
        avatar: user?.avatar ?? null,
        title: user?.title ?? null,
        badge: user?.badge ?? null,
      } as RawEditUserRequest),
    [user]
  );

  const { mutate, isLoading } = useEditUser();
  const [userDetails, setUserDetails] =
    useState<RawEditUserRequest>(initialState);

  useEffect(() => {
    setUserDetails(initialState);
  }, [initialState]);

  if (!user || !userDetails) {
    return null;
  }

  const createSettingSection = (item: SettingSection) => (
    <UserSetting
      item={item}
      key={item.key}
      value={(
        Object.entries(userDetails).filter(
          ([key, value]) => key === item.key
        )?.[0][1] ?? ""
      ).toString()}
      onChange={(val) => {
        mutate({ ...userDetails, [item.key]: val });
      }}
    />
  );

  return (
    <Screen scrollable extraSpace>
      <Avatar
        user={user}
        size="xl"
        editable
        badge={userDetails.badge ?? undefined}
        callback={(image: Image) => {
          setUserDetails((prev) => ({
            ...prev,
            avatar: image,
          }));
        }}
      />

      <Stack>
        <FormLabel>Profile</FormLabel>

        <YStack w="100%" space={2} alignItems="center">
          <Input
            type="text"
            value={userDetails.username}
            placeholder="Username"
            onChangeText={(text) =>
              setUserDetails((prev) => ({
                ...prev,
                username: text,
              }))
            }
          />

          <Input
            type="text"
            placeholder="Email"
            value={userDetails.email}
            onChangeText={(text) =>
              setUserDetails((prev) => ({
                ...prev,
                email: text,
              }))
            }
          />

          <Input
            type="text"
            placeholder="Height"
            value={userDetails.height}
            onChangeText={(text) =>
              setUserDetails((prev) => ({
                ...prev,
                height: parseInt(text, 10),
              }))
            }
          />

          <Input
            type="text"
            placeholder="Weight"
            value={userDetails.weight}
            onChangeText={(text) =>
              setUserDetails((prev) => ({
                ...prev,
                weight: parseInt(text, 10),
              }))
            }
          />

          <Input
            type="text"
            placeholder="Age"
            value={userDetails.age}
            onChangeText={(text) =>
              setUserDetails((prev) => ({
                ...prev,
                age: parseInt(text, 10),
              }))
            }
          />

          <Select
            w="90%"
            data={user.inventory.map((item) => {
              if (item.rewardType === "title") {
                return {
                  label: item.name,
                  value: item.id,
                };
              }
              return null;
            })}
            placeholder="Select a title"
            value={{
              label: userDetails.title?.id.toString() ?? "",
              value: userDetails.title?.id ?? "",
            }}
            labelExtractor={(item) => item?.label ?? ""}
            onChangeValue={(val) => {
              setUserDetails((prev) => ({
                ...prev,
                title: user.inventory.find(
                  (item) => item.id === val?.value
                ) as Title | null,
              }));
            }}
          />

          <Select
            w="90%"
            placeholder="Select a badge"
            data={user.inventory.map((item) => {
              if (item.rewardType === "badge") {
                return {
                  label: item.name,
                  value: item.id,
                };
              }
              return null;
            })}
            labelExtractor={(item) => item?.label ?? ""}
            value={{
              label: userDetails.badge?.id.toString() ?? "",
              value: userDetails.badge?.id ?? "",
            }}
            onChangeValue={(val) => {
              setUserDetails((prev) => ({
                ...prev,
                badge: user.inventory.find(
                  (item) => item.id === val?.value
                ) as Badge | null,
              }));
            }}
          />
        </YStack>
      </Stack>

      <Button
        w="%90"
        onPress={() =>
          mutate({
            ...userDetails,
            userId: user.id,
          })
        }
      >
        Save
      </Button>

      <Stack w="95%" mt={2}>
        <FormLabel ml={2}>Settings</FormLabel>
        {settingsSections.data.map(createSettingSection)}
      </Stack>
    </Screen>
  );
}

export const Settings = React.memo(SettingsInternal);
