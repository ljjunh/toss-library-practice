const isServer = (): boolean => {
  return typeof window === "undefined";
};

export { isServer };
