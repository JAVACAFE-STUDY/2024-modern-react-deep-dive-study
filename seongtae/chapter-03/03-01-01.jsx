const MyReact = function () {
  const global = {};
  let index = 0;

  function useState(initialState) {
    if (!global.states) {
      // 애플리케이션 전체의 states 배열을 초기화합니다.
      // 최초 접근이라면 빈 배열로 초기화합니다.
      global.states = [];
    }

    // states 정보를 조회해서 현재 상태값이 있는지 확인하고,
    // 없다면 초깃값으로 설정합니다.
    const currentState = global.states[index] || initialState;

    // states의 값을 위에서 조회한 현재 값으로 업데이트합니다.
    global.states[index] = currentState;

    // 즉시 실행 함수로 setter를 만듭니다.
    const setState = (function () {
      // 현재 index를 클로저로 가둬놔서 이후에도 계속해서 동일한 index에
      // 접근할 수 있도록 합니다.
      const currentIndex = index;
      return function (value) {
        global.states[currentIndex] = value;
        // 컴포넌트를 렌더링합니다. 실제로 컴포넌트를 렌더링하는 코드는 생략했습니다.
      };
    })();

    // useState를 쓸 때마다 index를 하나씩 추가합니다.
    // 이 index는 setState에서 사용됩니다.
    index = index + 1;

    return [currentState, setState];
  }

  // 실제 useState를 사용하는 컴포넌트
  function Component() {
    const [value, setValue] = useState(0);    
  }
};
