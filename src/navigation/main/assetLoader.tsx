import { useExercises } from "api";
import { Heading } from "components";
import React, { useEffect, useState } from "react";
import { Dirs } from "react-native-file-access";
import RNFetchBlob from "rn-fetch-blob";
import { Exercise } from "types";
import { LoadingMessage } from "./loadingMessage";

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

  // bail out if theres nothing to do
  useEffect(() => {
    if (finished) {
      setProgress((prev) => ({ current: prev.total, total: prev.total }));
    }
  }, [finished, setProgress]);

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
    return <LoadingMessage title="Checking assets..." />;
  }

  return <LoadingMessage title="Loading assets..." description={`${progress.current}/${progress.total}`} />;
};
