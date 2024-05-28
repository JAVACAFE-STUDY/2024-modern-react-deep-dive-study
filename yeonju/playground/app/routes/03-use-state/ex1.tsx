import { useEffect, useState } from "react";

export default function Ex1() {
  const [, triggerRender] = useState<string[]>([]);

  let state = "hello";

  function handleButtonClick() {
    state = "hi";
    triggerRender([]);

    console.log(`✨ 변경 후 state값: ${state}`);
  }

  useEffect(() => {
    console.log("🚨 함수 호출!");
    console.log(`🐤 변경 전 state값: ${state}`);
  });

  return (
    <>
      <h2>{state}</h2>
      <p>state: [] </p>
      <p>setState: []</p>
      <ul>
        <li>JavaScript에서 배열은 참조 타입</li>
        <li>매번 새로운 배열을 생성하면 그 배열의 메모리 주소가 달라짐</li>
        <li>
          React는 이 메모리 주소의 변경을 상태가 변경되었다고 간주하고
          컴포넌트를 리렌더링
        </li>
      </ul>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
