import { useCallback, useState } from "react";

/**
 * 불리언 상태와 그 상태를 토글하는 함수를 제공하는 훅
 * @param defaultValue 초기 상태 값 (기본값 : false)
 * @returns [상태, 토클 함수] 튜플
 */
export const useToggleState = (
  defaultValue: boolean = false
): readonly [boolean, () => void] => {
  const [bool, setBool] = useState<boolean>(defaultValue);

  // 상태를 토글하는 함수
  const toggle = useCallback(() => {
    setBool((prevBool) => !prevBool);
  }, []);

  return [bool, toggle] as const;
};
