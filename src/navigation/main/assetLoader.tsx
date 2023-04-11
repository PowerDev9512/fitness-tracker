import { useExercises } from "api";
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
  const [missingAssets, setMissingAssets] = useState<Exercise[]>([]);
  const [finished, setFinished] = useState(false);

  const { data: exercises } = useExercises({
    retrieveImages: false,
  });

  const { data: exercisesWithImages } = useExercises({
    retrieveImages: true,
    shouldFetch: missingAssets.length > 0,
  });

  // check for missing assets
  useEffect(() => {
    if (!exercises) {
      return;
    }

    const doesExerciseHaveImage = async (exercise: Exercise) => {
      const fileName = `${Dirs.DocumentDir}/${exercise.muscleGroupImageId}.png`;
      return await RNFetchBlob.fs.exists(fileName);
    };

    const promises = exercises.map(async (exercise, i) => {
      const exists = await doesExerciseHaveImage(exercise);
      return { exists, exercise };
    });

    Promise.all(promises).then((results) => {
      const missing = results.filter((r) => !r.exists).map((r) => r.exercise);
      setMissingAssets(missing);

      if (missing.length === 0) {
        setFinished(true);
      } else {
        setProgress(() => ({
          current: 0,
          total: missing.length,
        }));
      }
    });
  }, [exercises, setProgress]);

  // bail out if theres nothing to do
  useEffect(() => {
    if (finished) {
      setProgress((prev) => ({ current: prev.total, total: prev.total }));
    }
  }, [finished, setProgress]);

  // create missing assets
  useEffect(() => {
    if (missingAssets.length > 0 && exercisesWithImages) {
      setProgress(() => ({
        current: 0,
        total: missingAssets.length,
      }));

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
  }, [exercisesWithImages, missingAssets, setProgress]);

  if (progress.current === -1) {
    return <LoadingMessage title="Checking assets..." />;
  }

  return (
    <LoadingMessage
      title="Loading assets..."
      description={`${progress.current}/${progress.total}`}
    />
  );
};
