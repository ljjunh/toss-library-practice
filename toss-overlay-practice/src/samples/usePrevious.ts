import { useEffect, useRef } from "react";

/**
 * 이전 값을 저장하고 반환하는 훅
 * @param value 현재 값
 * @param options 옵션 객체
 * @param options.defaultValue 초기 렌더링 시 반환할 기본값 (설정하지 않으면 현재 값이 사용됨)
 * @returns 이전 값 (초기 렌더링 시에는 defaultValue 또는 현재 값)
 */
export const usePrevious = <T>(
  value: T,
  { defaultValue }: { defaultValue?: T } = {}
): T => {
  // ref로 값을 저장(렌더링 사이에 값을 유지)
  const ref = useRef<T>(defaultValue != null ? defaultValue : value);

  // 렌더링 후에 현재 값을 ref에 저장
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // 이전 값 반환(첫 렌더링에서는 defaultValue 또는 현재 값)
  return ref.current;
};
