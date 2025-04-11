import { Ref, useCallback } from "react";

type CallbackRef<T> = (ref: T | null) => void;

export function useCombinedRefs<T>(
  ...refs: Array<Ref<T> | CallbackRef<T>>
): Ref<T> {
  return useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
