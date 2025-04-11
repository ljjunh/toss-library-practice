import { useReducer } from "react";
const updater = (num: number): number => {
  return (num + 1) % 1000000;
};

const useForceUpdate = (): (() => void) => {
  const [, forceUpdate] = useReducer(updater, 0);

  return forceUpdate;
};

export { useForceUpdate };
