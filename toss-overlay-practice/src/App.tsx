import { DebounceClick, useInputState } from "@toss/react";
import { useEffect, useState } from "react";
import ProductSelectionExample from "./examples/ProduceSelectionExample";
import TodoListExample from "./examples/TodoListExample";
import { useBodyClass } from "./samples/useBodyClass";
import { useCallbackOnce } from "./samples/useCallbackOnce";
import { useDidUpdate } from "./samples/useDidUpdate";
import { useToggleState } from "./samples/useToggleState";

function App() {
  const [value, handleInputChange] = useInputState("", (value) =>
    value.replace(/\D/g, "")
  );

  useBodyClass("junhee");

  const [count, setCount] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [isOpen, toggleOpen] = useToggleState();

  // 일반적인 useEffect - 컴포넌트 마운트 시와 매번 count가 변경될 때 실행됨
  useEffect(() => {
    console.log("일반 useEffect : count 변경 감지", count);

    if (count > 0) {
      document.title = `카운트: ${count}`;
    }
  }, [count]);

  // useDidUpdate - 오직 업데이트 시에만 실행됨(첫 번째 렌더링은 제외)
  useDidUpdate(() => {
    console.log("useDidUpdate : count 변경 감지", count);

    alert(`카운트가 ${count}로 업데이트 되었습니다.`);

    return () => {
      console.log("이전 count값:", count);
    };
  }, [count]);

  // 일반 버튼 클릭 핸들러(여러번 실행됨)
  const handleNormalClick = () => {
    setCount((prev) => prev + 1);
  };

  // 한 번만 실행되는 버튼 클릭 핸들러
  const handleOnceClick = useCallbackOnce(() => {
    setHasClicked(true);
    alert("이 알림은 딱 한번만 표시됩니다!");
  }, []);

  return (
    <>
      <DebounceClick wait={200}>
        <button
          onClick={() => {
            alert("onClick 이벤트 발생");
          }}
        >
          클릭
        </button>
      </DebounceClick>
      <input value={value} onChange={handleInputChange} />
      <div>
        <button onClick={handleNormalClick}>
          일반 버튼 (클릭 횟수: {count})
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleOnceClick}
          disabled={hasClicked}
          style={{
            backgroundColor: hasClicked ? "#ccc" : "#4CAF50",
            cursor: hasClicked ? "not-allowed" : "pointer",
          }}
        >
          {hasClicked ? "이미 클릭됨" : "한 번만 클릭 가능한 버튼"}
        </button>
        {hasClicked && <p>버튼이 이미 클릭되었습니다.</p>}
      </div>
      <TodoListExample />
      <ProductSelectionExample />
      <button onClick={toggleOpen}>{isOpen ? "닫기" : "열기"}</button>
    </>
  );
}

export default App;
