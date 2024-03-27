function ExpensiveComponent({ value }) {
  useEffect(() => {
    console.log('rendering!');
  }, []);

  return <span>{value + 1000}</span>;
}

function App() {
  const [value, setValue] = useState(10);
  const [, triggerRendering] = useState(false);

  // 컴포넌트의 props를 기준으로 컴포넌트 자체를 메모이제이션했다.
  const MemoizedComponent = useMemo(() => <ExpensiveComponent value={value} />, [value]);

  function handleChange(e) {
    setValue(Number(e.target.value));
  }

  function handleClick() {
    triggerRendering((prev) => !prev);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <button onClick={handleClick}>렌더링 발생!</button>
      {MemoizedComponent}
    </>
  );
}
