import { useEffect, useState } from "react";

export default function UseEffectPage() {
  const [counter, setCounter] = useState<number>(0);

  function handleClick() {
    setCounter((prev) => prev + 1);
  }

  useEffect(() => {
    function addMouseEvent() {
      console.log(counter);
    }

    window.addEventListener("click", addMouseEvent);

    // 클린업 함수
    return () => {
      console.log("클린업 함수 실행!", counter);
      window.removeEventListener("click", addMouseEvent);
    };
  }, [counter]);

  return (
    <>
      <h1>{counter}</h1>
      <button onClick={handleClick}>+</button>
    </>
  );
}
