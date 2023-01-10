import { Check } from "@tamagui/lucide-icons";
import { Select as SelectBase } from "tamagui";

interface BaseProps<T> {
  data: T[];
  labelExtractor: (item: T) => string;
  value: T | undefined;
  onChangeValue: (value: T) => void;
  placeholder: string;
  isDisabled?: boolean;
}

type Props<T> = BaseProps<T> & React.ComponentProps<typeof SelectBase.Viewport>;

export const Select = <T extends unknown>({
  data,
  value,
  placeholder,
  labelExtractor,
  onChangeValue,
  isDisabled = false,
  ...props
}: Props<T>) => (
  <SelectBase defaultValue="" {...props}>
    <SelectBase.Trigger disabled={isDisabled}>
      <SelectBase.Value placeholder={placeholder} />
    </SelectBase.Trigger>

    <SelectBase.Content>
      <SelectBase.ScrollUpButton />

      <SelectBase.Viewport>
        <SelectBase.Group>
          {data.map((item, i) => {
            const label = labelExtractor(item);
            return (
              <SelectBase.Item
                index={i}
                key={label}
                value={label.toLowerCase()}
              >
                <SelectBase.ItemText>{label}</SelectBase.ItemText>
                <SelectBase.ItemIndicator ml="auto">
                  <Check size={16} />
                </SelectBase.ItemIndicator>
              </SelectBase.Item>
            );
          })}
        </SelectBase.Group>
      </SelectBase.Viewport>

      <SelectBase.ScrollDownButton />
    </SelectBase.Content>
  </SelectBase>
);
