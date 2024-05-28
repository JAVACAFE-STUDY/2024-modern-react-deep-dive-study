# 10 리액트 17과 18의 변경 사항 살펴보기

10.1 리액트 17 버전 살펴보기

- 리액트의 점진적인 업그레이드
- 이벤트 위임 방식의 변경
  - 리액트의 이벤트는 이제 document가 아닌 리액트 최상단 요소에 추가된다.
- import React from 'react'가 더 이상 필요 없다: 새로운 JSX transform
- 그밖의 주요 변경 사항 - 이벤트 풀링 제거 - useEffect 클린업 함수의 비동기 실행 - 리액트 16 버전까지 useEffect 의 클린업 함수가 동기적으로 처리되었다. 이는 클린업 함수가 완료되기 전까지 다른 작업을 방해하기 때문에 불필요한 성능 저하로 이어지는 문제가 존재했다. 리액트 17버전부터는 화면이 완전히 업데이트된 이후에 클린업 함수가 비동기적으로 실행된다. - 컴포넌트의 undefined 반환에 대한 일관적인 처리 - 컴포넌트 내부에서 undefined를 반환하면 오류가 발생해야 정상이지만 리액트 16에서는 useMemo 또는 forwardRef를 사용할 경우 에러가 발생하지 않는 문제가 있었다. 17부터는 정상적으로 에러가 발생한다.

  10.2 리액트 18 버전 살펴보기

- 새로 추가된 훅 살펴보기
  - useId
    - 컴포넌트별로 유니크한 값을 생성하는 새로운 훅
    - 서버사이드와 클라이언트 간에 동일한 값이 생성되어 하이드레이션 이슈도 발생하지 않는다 (Math.random() 이슈)
  - useTransition
    - UI 변경을 가로막지 않고 상태를 업데이트할 수 있는 훅
    - 렌더링이 오래걸리는 컴포넌트의 렌더링을 동기적으로 기다리지 않고 비동기적으로 렌더링 할 수 있게 해준다.
  - useDeferredValue
    - useTransition와 유사함
    - 차이점: useTransition 은 state값을 업데이트하는 함수이고 useDeferredValue 는 state값 자체만을 감싸서 사용한다
    ```typescript
    const [isPending, startTransition] = useTransition();
    const deferredText = useDeferredValue(text);
    ```
  - useSyncExternalStore (리액트 18버젼)
    - useSubsription -> useSuncExternalStore
    - useTransition, useDeferredValue 등으로 렌더링을 일시 중지하거나 뒤로 미루는 등의 최적화가 가능해지며 동시성 이슈가 발생할 수 있게 되었고 리액트 밖의 값에 대해서 (innerWidth 같은 경우) 해당 현상에 대한 이슈 해결을 위해 등장
  - useInsertionEffect
    - useInsertionEffect는 DOM이 실제로 변경되기 전에 동기적으로 실행
    - 브라우저가 다시 스타일을 입혀서 DOM을 재계산하지 않아도 된다
- react-dom/client
  - createRoot : react-dom에 있던 render 메서드를 대체
  - hydrateRoot : 서버 사이드 렌더링 애플리케이션에서 하이드레이션을 하기 위한 새로운 메서드
- react-dom/server
  - renderToPipeableStream
  - renderToReadableStream
- 자동 배치(Automatic Batching)
  - 여러개의 상태변화를 하나의 리렌더링으로 묶어서 성능을 향상시키는 방법
  - 리액트 17버전에서는 settimeout , promise 같은 비동기 이벤트에서는 자동배치가 이뤄지고 있지 않았기 때문에 해당 부분에서 자동배치가 일어나지 않았지만
  - 리액트 18버전에서 부터는 루트 컴포넌트를 createRoot를 사용해서 만들며 모든 업데이트가 배치 작업으로 최적화 할 수 있게 되었다.
- 더욱 엄격해진 엄격 모드
  - 더이상 안전하지 않은 특정 생명주기를 사용하는 컴포넌트에 대한 경고
  - 문자열 ref 사용 금지
  - findDOMNode에 대한 경고 출력
  - 구 ContextAPI 사용시 발생하는 경고
  - 에상치 못한 부작용(side-effects) 검사
- 리액트 18에서 추가된 엄격 모드

#### Suspense기능 강화

- Susponse : 컴포넌트를 동적으로 가져올 수 있게 도와준다
- fallback :  컴포넌트가 아직 불러와지지 않았을 때 보여주는 컴포넌트
