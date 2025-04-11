import { useEffect, useLayoutEffect } from "react";
import { isClient } from "./isClient";

const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect;

export { useIsomorphicLayoutEffect };
