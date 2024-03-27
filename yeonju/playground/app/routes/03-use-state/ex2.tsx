import { useEffect, useState } from "react";

export default function Ex2() {
  const [, triggerRender] = useState<string>("haha");

  let state = "hello";

  function handleButtonClick() {
    state = "hi";
    triggerRender("haha");

    console.log(`✨✨ 변경 후 state값: ${state}`);
  }

  useEffect(() => {
    console.log("🚨🚨 함수 호출!");
    console.log(`🐤🐤 변경 전 state값: ${state}`);
  });

  return (
    <>
      <h2>{state}</h2>
      <p>{`state: 'haha'`}</p>
      <p>{`setState: 'haha'`}</p>
      <ul>
        <li>문자열은 JavaScript에서 원시 타입(primitive type)</li>
        <li>
          원시 타입의 값은 변경 불가능(immutable)하며, 변수에 할당될 때 메모리에
          저장된 실제 값이 직접적으로 할당됨
        </li>
        <li>따라서, 두 문자열을 비교할 때는 그 값 자체를 비교하게 됨</li>
      </ul>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
