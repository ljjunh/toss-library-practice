import { ChangeEventHandler, useCallback, useState } from "react";

const useInputState = (
  initialValue: string = "",
  transformValue: (value: string) => string = echo
): readonly [string, ChangeEventHandler<HTMLElement & { value: string }>] => {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLElement & { value: string }>) => {
      setValue(transformValue(event.target.value));
    },
    [transformValue]
  );

  return [value, handleValueChange] as const;
};

const echo = (v: string): string => {
  return v;
};

export { useInputState };
