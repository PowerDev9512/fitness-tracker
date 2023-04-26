import { RawEditUserRequest, useEditUser, useGetUser } from "api";
import {
  Avatar,
  Button,
  FormLabel,
  Input,
  Screen,
  Select,
  SelectData,
} from "components";
import React, { useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { Stack, YStack } from "tamagui";
import { Badge, Image, Title } from "types";

import { UserSetting } from "./components/userSetting";
import { SettingSection, settingsSections } from "./settingsSections";

const SettingsInternal = () => {
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

  const {
    mutate: update,
    isLoading: isUpdating,
    isSuccess: savedSuccessfully,
  } = useEditUser();

  const [userDetails, setUserDetails] =
    useState<RawEditUserRequest>(initialState);

  useEffect(() => {
    setUserDetails(initialState);
  }, [initialState]);

  useEffect(() => {
    if (savedSuccessfully) {
      Toast.show({
        text1: "Settings saved successfully!",
        type: "success",
      });
    }
  }, [savedSuccessfully]);

  const titleOptions = useMemo(() => {
    return (user?.inventory ?? [])
      .filter((item) => item.rewardType === "title")
      .map((title) => title as Title)
      .map((title) => ({
        label: title.name,
        value: title.id,
      })) as SelectData<number>[];
  }, [user]);

  const badgeOptions = useMemo(() => {
    return (user?.inventory ?? [])
      .filter((item) => item.rewardType === "badge")
      .map((badge) => badge as Badge)
      .map((badge) => ({
        label: badge.name,
        value: badge.id,
      })) as SelectData<number>[];
  }, [user]);

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
        update({ ...userDetails, [item.key]: val });
      }}
    />
  );

  if (!user || !userDetails) {
    return null;
  }

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

      <Stack w="100%" space={2} alignItems="center">
        <YStack w="100%" space={2} alignItems="center">
          <FormLabel mr="auto" variant="title">
            Username
          </FormLabel>
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

          <FormLabel mr="auto" variant="title">
            Email
          </FormLabel>
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

          <FormLabel mr="auto" variant="title">
            Height
          </FormLabel>
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

          <FormLabel mr="auto" variant="title">
            Weight
          </FormLabel>
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

          <FormLabel mr="auto" variant="title">
            Age
          </FormLabel>
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

          <FormLabel mr="auto" variant="title">
            Title
          </FormLabel>
          <Select
            w="100%"
            data={titleOptions}
            placeholder="Select a title"
            value={titleOptions.find(
              (item) => item.value === userDetails.title?.id
            )}
            onChangeValue={(val: number) => {
              setUserDetails((prev) => ({
                ...prev,
                title: user.inventory.find(
                  (item) => item.id === val
                ) as Title | null,
              }));
            }}
          />

          <FormLabel mr="auto" variant="title">
            Badge
          </FormLabel>
          <Select
            w="100%"
            placeholder="Select a badge"
            data={badgeOptions}
            value={badgeOptions.find(
              (item) => item.value === userDetails.badge?.id
            )}
            onChangeValue={(val: number) => {
              setUserDetails((prev) => ({
                ...prev,
                badge: user.inventory.find(
                  (item) => item.id === val
                ) as Badge | null,
              }));
            }}
          />
        </YStack>
      </Stack>

      <Button
        accessibilityLabel="Save settings"
        w="100%"
        isLoading={isUpdating}
        onPress={() =>
          update({
            ...userDetails,
            userId: user.id,
          })
        }
      >
        Save
      </Button>

      <Stack w="100%" mt={2}>
        <FormLabel ml={2}>Settings</FormLabel>
        {settingsSections.data.map(createSettingSection)}
      </Stack>
    </Screen>
  );
};

export const Settings = React.memo(SettingsInternal);
