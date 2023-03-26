import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { Text } from "tamagui";

import { Screen } from "../../components/screen";
import { ActivityCard } from "./activityCard";

interface Props {
  route: {
    params: {
      mainActivityId: number;
    };
  };
}

export const ActivityDetails = ({ route }: Props) => {
  const { data: user } = useGetUser();
  const navigation = useNavigation();

  const activities =
    user?.workouts
      .map((workout) =>
        workout.activities.map((activity) => ({ ...workout, activity }))
      )
      .flat() ?? [];

  const mainActivity = activities.find(
    (a) => a.activity.id === route.params.mainActivityId
  );

  useEffect(() => {
    if (mainActivity !== undefined) {
      navigation.setOptions({
        title: mainActivity.activity.name,
      });
    }
  }, [mainActivity, navigation]);

  if (mainActivity === undefined) {
    return <Text>Activity not found</Text>;
  }

  const filteredActivities = activities
    .filter(
      (a) =>
        a.activity.exerciseId === mainActivity?.activity.exerciseId &&
        a.id !== mainActivity.id
    )
    .sort((a, b) => b.time.localeCompare(a.time));

  return (
    <Screen>
      <FlatList
        style={{ width: "100%" }}
        data={filteredActivities}
        ListHeaderComponent={<ActivityCard workout={mainActivity} isMain={true} />}
        renderItem={({ item }) => <ActivityCard workout={item} isMain={false} />}
      />
    </Screen>
  );
};
