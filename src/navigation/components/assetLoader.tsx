import { useExercises } from "api";
import { Loading } from "components";
import React, { useEffect, useState } from "react";
import { Dirs } from "react-native-file-access";
import RNFetchBlob from "rn-fetch-blob";
import { Heading, Spinner, Stack, XStack } from "tamagui";
import { Exercise } from "types";

type Progress = { current: number; total: number };

interface Props {
  progress: Progress;
  setProgress: (progress: (prev: Progress) => Progress) => void;
}

export function AssetLoader({ progress, setProgress }: Props) {
  const [missingAssets, setMissingAssets] = useState<Exercise[]>([]);

  const { data: exercises, isLoading: exercisesLoading } = useExercises({
    retrieveImages: false,
  });

  useEffect(() => {
    if (exercisesLoading || !exercises) {
      return;
    }

    const tasks = exercises.map(async (exercise) => {
      const fileName = `${Dirs.DocumentDir}/${exercise.muscleGroupImageId}.png`;
      const exists = await RNFetchBlob.fs.exists(fileName);
      return { exists, exercise };
    });

    Promise.all(tasks.splice(0, 2))
      .then((results) =>
        results.filter((r) => !r.exists).map((r) => r.exercise)
      )
      .then((missing) => setMissingAssets(missing));
  }, [exercisesLoading, exercises]);

  const { data: exercisesWithImages } = useExercises({
    retrieveImages: true,
    shouldFetch: missingAssets.length > 0,
  });

  useEffect(() => {
    if (missingAssets.length > 0) {
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
    }

    if (missingAssets.length === 0 && exercises) {
      setProgress(() => ({ current: 0, total: 0 }));
    }
  }, [missingAssets, exercises, setProgress, exercisesWithImages]);

  if (progress.current === -1) {
    return <Loading />;
  }

  return (
    <Stack h="100%">
      <XStack mt={10} space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading page" />
        <Heading color="$primary500" fontSize="md">
          Downloading assets
        </Heading>
        <Heading color="$primary500" fontSize="md">
          {progress.current}/{progress.total}
        </Heading>
      </XStack>
    </Stack>
  );
}
