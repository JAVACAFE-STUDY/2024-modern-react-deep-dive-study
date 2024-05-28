import { useState, useEffect, useCallback } from "preact/hooks";
import { memo } from "preact/compat";

interface ChildComponentProps {
  name: string;
  value: boolean;
  onChange: () => void;
}

const ChildComponent = memo(
  ({ name, value, onChange }: ChildComponentProps) => {
    // 렌더링이 수행되는지 확인하기 위해 넣었다.
    useEffect(() => {
      console.log("rendering!", name);
    });

    return (
      <>
        <h1>
          {name} {value ? "켜짐" : "꺼짐"}{" "}
        </h1>
        <button onClick={onChange}>toggle</button>{" "}
      </>
    );
  }
);

export function App() {
  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(false);

  // const toggle1 = () => {
  //   setStatus1(!status1);
  // };

  // const toggle2 = () => {
  //   setStatus2(!status2);
  // };

  const toggle1 = useCallback(
    function toggle1() {
      setStatus1(!status1);
    },
    [status1]
  );

  const toggle2 = useCallback(
    function toggle2() {
      setStatus2(!status2);
    },
    [status2]
  );

  return (
    <>
      <ChildComponent name="1" value={status1} onChange={toggle1} />
      <ChildComponent name="2" value={status2} onChange={toggle2} />
    </>
  );
}
