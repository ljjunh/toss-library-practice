import { DependencyList, useEffect, useRef } from "react";

// 어떤 상황에서 사용할까?
// 1. API 호출 최적화
//    - 입력값이 변경될 때만 API 요청을 보내고 싶을 때
//    - 초기 렌더링에서는 API 호출을 피하고 싶을 때
// 2. 불필요한 알림 방지
//    - 상태 변경 시 알림이나 토스트 메시지를 표시하고 싶지만, 컴포넌트 첫 로드시에는 표시하고 싶지 않을 때
// 3. 이벤트 구독 관리
//    - 특정 상태가 변경된 후에만 외부 이벤트 구독을 설정/변경하고 싶을 때
// 4. 애니메이션 트리거
//    - 값이 변경될 때만 애니메이션을 트리거하고 싶고, 초기 렌더링에서는 애니메이션 없이 초기 상태만 표시하고 싶을 때
// 5. 폼 유효성 검사
//    - 폼 값이 변경될 때만 유효성 검사를 실행하고, 초기 폼 로드 시에는 검증 메시지를 표시하지 않을 때

/**
 * 컴포넌트의 첫 번째 렌더링을 제외하고 이후 렌더링에서만 효과를 실행하는 훅(엄격모드 끄고 테스트하세요)
 * @param effect 실행할 효과 함수(정리 함수를 반환할 수 있음)
 * @param deps 의존성 배열
 */
// <F extends () => (() => void) | void> : F가 인자를 받지 않고, 이 함수의 반환타입이
// ()=>void 클린업이거나 void여야 한다는 의미
export const useDidUpdate = <F extends () => (() => void) | void>(
  effect: F,
  deps: DependencyList
): void => {
  // 컴포넌트가 마운트 되었는지 추적하는 ref
  const hasMounted = useRef(false);

  useEffect(() => {
    // 첫 번째 렌더링이면 마운트 상태만 업데이트하고 효과는 실행하지 않음
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // 두 번째 렌더링부터는 효과 실행
    return effect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
