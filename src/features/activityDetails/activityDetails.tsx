import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "api";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { Text } from "tamagui";

import { ActivityCard } from "./activityCard";
import { Screen } from "../../components/screen";

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
        title: mainActivity.name,
      });
    }
  }, [mainActivity, navigation]);

  if (mainActivity === undefined) {
    return <Text>Activity not found</Text>;
  }

  const filteredActivities = activities
    .filter(
      (a) =>
        a.activity.exercise.id === mainActivity?.activity.exercise.id &&
        a.id !== mainActivity.id
    )
    .sort((a, b) => b.time.localeCompare(a.time));

  return (
    <Screen>
      <FlatList
        style={{ width: "100%" }}
        data={filteredActivities}
        ListHeaderComponent={<ActivityCard workout={mainActivity} isMain />}
        renderItem={({ item }) => (
          <ActivityCard workout={item} isMain={false} />
        )}
      />
    </Screen>
  );
};
