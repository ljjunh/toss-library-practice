import { useCheckList } from "../samples/useCheckList";

interface Product {
  id: string;
  name: string;
  price: number;
  checked?: boolean;
}

const ProductSelectionExample: React.FC = () => {
  //상품 목록
  const products: Product[] = [
    { id: "p1", name: "노트북", price: 1200000, checked: false },
    { id: "p2", name: "스마트폰", price: 800000, checked: false },
    { id: "p3", name: "헤드폰", price: 300000, checked: false },
    { id: "p4", name: "키보드", price: 150000, checked: false },
    { id: "p5", name: "마우스", price: 50000, checked: false },
  ];

  const { list, isChecked, toggle, checkAll, unCheckAll, getCheckedList } =
    useCheckList<Product>(products);

  // 선택된 상품의 총 금액 계산
  const totalPrice = getCheckedList().reduce(
    (sum, product) => sum + product.price,
    0
  );

  return (
    <div>
      <h2>상품 선택</h2>

      <div>
        <button onClick={checkAll}>모두 선택</button>
        <button onClick={unCheckAll}>모두 선택 해제</button>
      </div>

      <ul>
        {list.map((product) => (
          <li key={product.id}>
            <label>
              <input
                type="checkbox"
                checked={isChecked(product.id) || false}
                onChange={() => toggle(product.id)}
              />
              <span>{product.name}</span>
              <span>{product.price.toLocaleString()}원</span>
            </label>
          </li>
        ))}
      </ul>

      <div>
        <p>선택된 상품 : {getCheckedList().length}개</p>
        <p>총 금액 : {totalPrice.toLocaleString()}원</p>

        {getCheckedList().length > 0 && <button>결제하기</button>}
      </div>
    </div>
  );
};

export default ProductSelectionExample;
