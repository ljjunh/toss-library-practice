import { useState } from "react";
import { useCheckList } from "../samples/useCheckList";

interface TodoItem {
  id: number;
  text: string;
  checked?: boolean;
}

// 체크리스트를 이용한 할 일 목록 예시
const TodoListExample: React.FC = () => {
  // 초기 할 일 목록
  const initialTodos: TodoItem[] = [
    { id: 1, text: "이메일 확인하기", checked: false },
    { id: 2, text: "회의 준비하기", checked: true },
    { id: 3, text: "점심 식사", checked: false },
    { id: 4, text: "보고서 작성", checked: false },
  ];

  const {
    list: todos,
    toggle,
    toggleAll,
    isChecked,
    unCheckAll,
    isAllChecked,
    getCheckedList,
    getCheckedIds,
    set,
  } = useCheckList<TodoItem>(initialTodos);

  // 완료된 항목 수 계산
  const completedCount = getCheckedList().length;

  // 새 할일 추가 기능
  const [newTodoText, setNewTodoText] = useState("");
  const [nextId, setNextId] = useState(5);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: nextId,
      text: newTodoText,
      checked: false,
    };

    // 기존 목록에 새 할 일 추가
    const updatedTodos = [...todos, newTodo];
    setNextId(nextId + 1);
    setNewTodoText("");
    set(updatedTodos);
  };

  return (
    <div>
      <h2>
        할 일 목록 ({completedCount}/{todos.length})
      </h2>
      <div>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="새 할 일 입력"
        />
        <button onClick={handleAddTodo}>추가</button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isAllChecked()}
            onChange={toggleAll}
          />
          <span>모두 {isAllChecked() ? "완료 취소" : "완료"}</span>
        </label>

        {completedCount > 0 && (
          <button onClick={unCheckAll}>모든 체크 해제</button>
        )}
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={isChecked(todo.id) || false}
                onChange={() => toggle(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>

      {completedCount > 0 && (
        <div>
          <p>완료된 항목 : {completedCount}개</p>
          <p>완료된 항목 ID : {getCheckedIds().join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default TodoListExample;
