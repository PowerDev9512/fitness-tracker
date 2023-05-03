import { useGetUser } from "api";
import { Accordion, Card } from "components";
import React from "react";
import { FlatList, Pressable } from "react-native";
import { useStore, ViewedScreens } from "store";
import { ScrollView, Text } from "tamagui";

type Message = {
  title: string;
  date: string;
  message: string;
  callback: () => void;
};

export const Messages = () => {
  const { data: user } = useGetUser();
  const { viewedScreens, setViewedScreens } = useStore();

  const data: Message[] = [
    {
      title: "Getting started",
      date: `5/1/2023${viewedScreens.messageTwo ? "" : " !"}`,
      callback: () => setViewedScreens("messageTwo", true),
      message:
        "Welcome to Pocket Coach! Here's a few tips to help you get started:" +
        "\n\n1. Tap on the 'Plus button' in the corner to get started with your first workout." +
        "\n\n2. Tap on the 'Schedule' tab to see your upcoming workouts." +
        "\n\n3. Fill out details about your workout in the 'Schedule' tab to get the most out of your workout." +
        "\n\n4. Complete the workout and watch it appear in the 'History' tab." +
        "\n\n5. You're on your way to becoming a Pocket Coach pro! Have fun exploring the app!",
    },
    {
      title: "Welcome",
      date: `5/1/2023${viewedScreens.messageOne ? "" : " !"}`,
      callback: () => setViewedScreens("messageOne", true),
      message:
        "Pocket Coach is a workout tracker that helps you get the most out of your workouts." +
        "\n\nIt's simple: schedule a workout, complete it, and watch your progress grow." +
        "\n\nPocket Coach will help you stay on track and reach your fitness goals.",
    },
  ];

  const renderMessage = ({
    item: { title, message, date, callback },
    index,
  }: {
    item: Message;
    index: number;
  }) => (
    <Card mb="$2">
      <Accordion
        title={title}
        key={`${title}-${index}`}
        secondTitle={date}
        callback={callback}
      >
        <ScrollView nestedScrollEnabled>
          <Text mt="$2" key={`${title}-${index}-text`}>
            {message}
          </Text>
        </ScrollView>
      </Accordion>
    </Card>
  );

  if (!user) {
    return null;
  }

  return (
    <Card px="$4" pb="$4">
      <FlatList
        data={data}
        nestedScrollEnabled
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.title}`}
      />
    </Card>
  );
};
