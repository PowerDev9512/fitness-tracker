import { Heading } from "components";
import { Spinner, Stack, XStack } from "tamagui";

interface Props {
  title: string;
  description?: string | null;
}

export const LoadingMessage = ({ title, description = null }: Props) => {
  return (
    <Stack h="100%" backgroundColor="$backgroundAccent">
      <XStack
        backgroundColor="$backgroundAccent"
        alignContent="center"
        justifyContent="center"
        mx="auto"
        my="auto"
      >
        <Heading color="$primary500" fontSize={16}>
          {title}
        </Heading>
        {description && (
        <Heading color="$primary500" fontSize={16}>
          {description}
        </Heading>
        )}
        <Spinner color="$primary500" ml={4} my="auto" accessibilityLabel="Loading page" />
      </XStack>
    </Stack>
  )
};
