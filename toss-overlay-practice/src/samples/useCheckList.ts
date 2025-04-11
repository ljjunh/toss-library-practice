import { useCallback, useRef } from "react";
import { useForceUpdate } from "./useForceUpdate";

// state가 아닌 ref를 사용한 이유
// React 18이후부터는 리액트 배치 때문에 여러항목을 업데이트해도 리렌더링이 여러번 발생하지 않음 근데 왜 ref를 쓰냐?
// 1. useRef는 항상 최신 데이터를 가리키니까 의존성 배열 없이도 항상 최신 데이터에 접근할 수 있음
// 2. useState를 useCallback의 의존성 배열에 넣으면 상태가 변경될 때마다 함수가 재생성되어 메모이제이션 효과가 사라짐

interface Item {
  id: string | number;
  checked?: boolean;
}

// T는 최소한 Item 인터페이스의 속성을 포함해야함
const useCheckList = <T extends Item>(initialItems: T[]) => {
  // useRef를 사용하여 리렌더링 사이에도 유지되는 아이템 목록 참조 생성
  // useState와 달리 값 변경 시 자동으로 리렌더링 되지 않음
  const listRef = useRef<T[]>(initialItems);

  // 필요할 때 수동으로 컴포넌트를 리렌더링 하기 위한 함수
  const forceUpdate = useForceUpdate();

  // ID로 아이템을 찾는 함수
  const findItem = useCallback((id: T["id"]) => {
    // 배열에서 주어진 id와 일치하는 첫 번째 아이템 반환
    return listRef.current.find(({ id: _id }) => _id === id);
  }, []);

  // ID로 아이템의 인덱스를 찾는 함수
  const findIndex = useCallback((id: T["id"]) => {
    // 배열에서 주어진 id와 일치하는 첫 번째 아이템의 인덱스 반환
    // 찾지 못하면 -1 반환
    return listRef.current.findIndex(({ id: _id }) => _id === id);
  }, []);

  // 특정 ID의 아이템이 체크되었는지 확인하는 함수
  const isChecked = useCallback(
    (id: T["id"]) => {
      // 옵셔널 체이닝을 사용하여 아이템이 없을 경우 undefined 반환
      return findItem(id)?.checked;
    },
    [findItem]
  );

  // 모든 아이템이 체크되었는지 확인하는 함수
  const isAllChecked = useCallback(() => {
    // every 메서드로 모든 아이템의 checked 속성이 true인지 확인
    return listRef.current.every(({ checked }) => checked);
  }, []);

  // 전체 목록을 새 아이템으로 설정하는 함수
  const set = useCallback(
    (items: T[]) => {
      // 참조 값 직접 변경
      listRef.current = items;
      // 변경사항을 UI에 반영하기 위해 리렌더링 강제
      forceUpdate();
    },
    [forceUpdate]
  );

  // 특정 아이템의 체크 상태를 업데이트 하는 함수
  const updateItem = useCallback(
    (id: T["id"], checked: boolean) => {
      // 아이템 인덱스 찾기
      const idx = findIndex(id);

      // 아이템이 존재한다면
      if (idx > -1) {
        const item = listRef.current[idx];

        // 체크 상태가 실제로 변경되었을 때만 업데이트
        if (item.checked !== checked) {
          // 배열을 복사하여 불변성 유지
          const arr = [...listRef.current];
          // 해당 인덱스의 아이템을 새 객체로 대체
          arr[idx] = {
            ...item,
            id,
            checked,
          };
          // 새 배열 설정 및 리렌더링
          set(arr);
        }
      }
    },
    [findIndex, set]
  );

  // 아이템의 체크 상태를 토글하는 함수
  const toggle = useCallback(
    (id: T["id"]) => {
      // 현재 체크 상태의 반대로 업데이트
      updateItem(id, !isChecked(id));
    },
    [isChecked, updateItem]
  );

  // 아이템을 체크하는 함수(체크 상태를 true로 설정)
  const check = useCallback(
    (id: T["id"]) => {
      updateItem(id, true);
    },
    [updateItem]
  );

  // 아이템의 체크를 제거하는 함수(체크 상태를 false로 설정)
  const unCheck = useCallback(
    (id: T["id"]) => {
      updateItem(id, false);
    },
    [updateItem]
  );

  // 모든 아이템의 체크 상태를 토글하는 함수
  const toggleAll = useCallback(() => {
    // 현재 전체 체크 상태를 반대로 할당
    const toggled = !isAllChecked();
    // 모든 아이템의 체크 상태를 새 값으로 업데이트
    const arr = listRef.current.map((item) => ({
      ...item,
      checked: toggled,
    }));
    // 새 배열 설정 및 리렌더링
    set(arr);
  }, [isAllChecked, set]);

  // 모든 아이템의 체크 상태를 특정 값으로 업데이트하는 함수
  const updateAll = useCallback(
    (checked: boolean) => {
      // 이미 모든 아이템이 원하는 상태라면 아무것도 하지 않음
      if (listRef.current.every((item) => item.checked === checked)) {
        return;
      }

      // 모든 아이템의 체크 상태를 새 값으로 업데이트
      set(
        listRef.current.map((item) => ({
          ...item,
          checked,
        }))
      );
    },
    [set]
  );

  // 모든 아이템을 체크하는 함수
  const checkAll = useCallback(() => {
    updateAll(true);
  }, [updateAll]);

  // 모든 아이템의 체크를 해제하는 함수
  const unCheckAll = useCallback(() => {
    updateAll(false);
  }, [updateAll]);

  // 체크된 아이템 목록만 반환하는 함수
  const getCheckedList = useCallback(() => {
    return listRef.current.filter((item) => item.checked);
  }, []);

  // 체크된 아이템의 ID 목록만 반환하는 함수
  const getCheckedIds = useCallback(() => {
    return listRef.current.filter((item) => item.checked).map(({ id }) => id);
  }, []);

  return {
    list: listRef.current, // 현재 아이템 목록
    set, // 목록 설정 함수
    isChecked, // 아이템 체크 확인 함수
    isAllChecked, // 전체 체크 확인 함수
    check, // 아이템 체크 함수
    unCheck, //아이템 체크 해제 함수
    toggle, // 아이템 체크 토글 함수
    updateItem, //아이템 업데이트 함수
    toggleAll, //전체 체크 토글 함수
    checkAll, //전체 체크 함수
    unCheckAll, //전체 체크 해제 함수
    updateAll, // 전체 업데이트 함수
    getCheckedList, // 체크된 아이템 목록 반환 함수
    getCheckedIds, // 체크된 아이템 ID 목록 반환 함수
  };
};

export { useCheckList };
