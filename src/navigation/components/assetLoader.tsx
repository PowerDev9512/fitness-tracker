import { useExercises } from "api";
import { Heading } from "components";
import React, { useEffect, useState } from "react";
import { Dirs } from "react-native-file-access";
import RNFetchBlob from "rn-fetch-blob";
import { Spinner, Stack, XStack } from "tamagui";
import { Exercise } from "types";

type Progress = { current: number; total: number };

interface Props {
  progress: Progress;
  setProgress: (progress: (prev: Progress) => Progress) => void;
}

export const AssetLoader = ({ progress, setProgress }: Props) => {
  const [missingAssets, setMissingAssets] = useState<Exercise[] | null>(null);
  const [finished, setFinished] = useState(false);

  const { data: exercises, isLoading: exercisesLoading } = useExercises({
    retrieveImages: false,
  });

  const { data: exercisesWithImages } = useExercises({
    retrieveImages: true,
    shouldFetch: missingAssets !== null && missingAssets.length > 0,
  });

  // bail out if we're done
  useEffect(() => {
    if (finished) {
      setProgress((prev) => ({ current: prev.total, total: prev.total }));
    }
  }, [finished, setProgress]);

  // check for missing assets
  useEffect(() => {
    if (!exercises) {
      return;
    }

    const missingExercises = exercises
      .map((exercise) => {
        const fileName = `${Dirs.DocumentDir}/${exercise.muscleGroupImageId}.png`;
        const exists = RNFetchBlob.fs.exists(fileName);
        return { exists, exercise };
      })
      .filter((r) => !r.exists)
      .map((r) => r.exercise);

    setMissingAssets(missingExercises);

    if (missingExercises.length === 0) {
      setFinished(true);
    }
  }, [exercisesLoading, exercises]);

  // create missing assets
  useEffect(() => {
    if (missingAssets && missingAssets.length > 0) {
      setProgress(() => ({ current: 0, total: missingAssets.length }));

      missingAssets.forEach((exercise) => {
        const matchingExercise = exercisesWithImages?.find(
          (e) => e.muscleGroupImageId === exercise.muscleGroupImageId
        );

        if (matchingExercise) {
          const fileName = `${Dirs.DocumentDir}/${matchingExercise.muscleGroupImage.id}.png`;
          RNFetchBlob.fs.writeFile(
            fileName,
            matchingExercise.muscleGroupImage.bytes,
            "base64"
          );
          setProgress((prev) => ({
            current: prev.current + 1,
            total: prev.total,
          }));
        }
      });

      setProgress((prev) => ({ current: prev.total, total: prev.total }));
      setFinished(true);
    }
  }, [missingAssets, exercises, setProgress, exercisesWithImages]);

  if (progress.current === -1) {
    return (
      <XStack
        backgroundColor="$backgroundAccent"
        alignContent="center"
        justifyContent="center"
        mx="auto"
        my="auto"
      >
        <Heading color="$primary500" fontSize={16}>
          Checking assets...
        </Heading>
        <Spinner accessibilityLabel="Loading page" />
      </XStack>
    );
  }

  return (
    <Stack h="100%">
      <XStack
        backgroundColor="$backgroundAccent"
        alignContent="center"
        justifyContent="center"
        mx="auto"
        my="auto"
      >
        <Spinner accessibilityLabel="Loading page" />
        <Heading color="$primary500" fontSize={16}>
          Downloading assets...
        </Heading>
        <Heading color="$primary500" fontSize={16}>
          {progress.current}/{progress.total}
        </Heading>
      </XStack>
    </Stack>
  );
};
