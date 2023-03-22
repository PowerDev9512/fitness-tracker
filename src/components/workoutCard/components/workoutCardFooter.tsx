import React from "react";

import { Separator } from "tamagui";

interface Props {
  content?: React.ReactNode;
}

export const WorkoutCardFooter = ({ content }: Props) => {
  if (!content) {
    return null;
  }

  return (
    <>
      <Separator mt="auto" mb="$4" bg="$gray200" />
      {content}
    </>
  );
};
