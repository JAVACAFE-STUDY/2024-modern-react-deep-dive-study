import { useEffect, useState } from "react";

export default function Ex3() {
  const [, triggerRender] = useState<string[] | undefined>([]);

  let state = "hello";

  function handleButtonClick() {
    state = "hi";
    triggerRender(undefined);

    console.log(`✨✨✨ 변경 후 state값: ${state}`);
  }

  useEffect(() => {
    // 컴포넌트의 렌더링이 완료된 이후에 실행
    console.log("🚨🚨🚨 함수 호출!");
    console.log(`🐤🐤🐤 변경 전 state값: ${state}`);
  });

  return (
    <>
      <h2>{state}</h2>
      <p>state: []</p>
      <p>setState: undefined</p>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
