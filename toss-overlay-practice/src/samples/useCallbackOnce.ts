import { DependencyList, useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCallbackOnce = <F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): ((...args: Parameters<F>) => void) => {
  const hasFired = useRef(false);

  const memoizedCallback = useCallback((...args: Parameters<F>) => {
    if (hasFired.current) {
      return;
    }

    callback(...args);
    hasFired.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return memoizedCallback;
};

export { useCallbackOnce };
