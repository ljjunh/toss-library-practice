import { isServer } from "./isServer";

const isClient = (): boolean => {
  return !isServer();
};

export { isClient };
