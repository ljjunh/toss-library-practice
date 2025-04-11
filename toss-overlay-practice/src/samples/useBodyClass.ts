import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const useBodyClass = (className: string): void => {
  useIsomorphicLayoutEffect(() => {
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};

export { useBodyClass };
